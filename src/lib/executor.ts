import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda'

const LAMBDA_FUNCTIONS: Record<string, string> = {
  python: 'maximizehire-python-executor',
  javascript: 'maximizehire-javascript-executor',
  java: 'maximizehire-java-executor',
  go: 'maximizehire-go-executor',
  rust: 'maximizehire-rust-executor',
  cpp: 'maximizehire-cpp-executor',
  c: 'maximizehire-c-executor',
  scala: 'maximizehire-scala-executor'
}

// Create Lambda client with explicit credentials
function createLambdaClient() {
  const region = process.env.AWS_REGION || 'us-west-2'
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

  if (!accessKeyId || !secretAccessKey) {
    throw new Error('AWS credentials not configured')
  }

  return new LambdaClient({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey
    }
  })
}

export interface ExecutionResult {
  success: boolean
  output?: string
  stdout?: string
  stderr?: string
  error?: string
  executionTime?: number
}

const DANGEROUS_PATTERNS = [
  /import\s+os/i, /import\s+subprocess/i, /system\s*\(/i, /exec\s*\(/i, /eval\s*\(/i,
  /require\s*\(\s*['"]fs['"]/i, /require\s*\(\s*['"]child_process['"]/i,
  /#include\s*<unistd\.h>/i, /Process\.start/i, /Runtime\.getRuntime/i,
  /std::process::/i, /os\.Remove/i, /os\/exec/i, /syscall/i,
  /std::fs::remove/i, /unsafe\s*{/i, /import\s+scala\.sys\.process/i
]

export async function executeCode(language: string, code: string): Promise<ExecutionResult> {
  const startTime = Date.now()

  // Validate language
  if (!LAMBDA_FUNCTIONS[language]) {
    return {
      success: false,
      error: `Unsupported language: ${language}. Supported: ${Object.keys(LAMBDA_FUNCTIONS).join(', ')}`
    }
  }

  // Validate code
  if (!code.trim()) {
    return { success: false, error: 'Code cannot be empty' }
  }

  if (code.length > 50000) {
    return { success: false, error: 'Code too large. Maximum size is 50KB.' }
  }

  // Security check
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(code)) {
      return { success: false, error: 'Code contains potentially dangerous operations.' }
    }
  }

  try {
    const lambdaClient = createLambdaClient()
    const functionName = LAMBDA_FUNCTIONS[language]

    // Encode code to base64
    const base64Code = Buffer.from(code, 'utf-8').toString('base64')

    const payload = {
      code: base64Code,
      isFinalSubmission: 'false',
      requestAIValidation: 'false'
    }

    console.log(`Invoking Lambda: ${functionName}`)
    console.log(`Code length: ${code.length}, Base64 length: ${base64Code.length}`)

    const command = new InvokeCommand({
      FunctionName: functionName,
      Payload: Buffer.from(JSON.stringify(payload)),
      InvocationType: 'RequestResponse'
    })

    const response = await lambdaClient.send(command)

    console.log(`Lambda response status: ${response.StatusCode}`)

    if (response.FunctionError) {
      console.error(`Lambda function error: ${response.FunctionError}`)
      const errorPayload = response.Payload ? new TextDecoder().decode(response.Payload) : 'Unknown error'
      console.error(`Error payload: ${errorPayload}`)
      return {
        success: false,
        error: `Execution error: ${response.FunctionError}`,
        executionTime: Date.now() - startTime
      }
    }

    if (!response.Payload) {
      return {
        success: false,
        error: 'No response from execution service',
        executionTime: Date.now() - startTime
      }
    }

    const responseString = new TextDecoder().decode(response.Payload)
    console.log(`Raw response: ${responseString.substring(0, 500)}`)

    let lambdaResponse
    try {
      lambdaResponse = JSON.parse(responseString)
    } catch (e) {
      console.error(`Failed to parse response: ${e}`)
      return {
        success: false,
        error: 'Invalid response from execution service',
        executionTime: Date.now() - startTime
      }
    }

    // Handle Lambda response
    if (lambdaResponse.statusCode && lambdaResponse.body) {
      try {
        const bodyData = JSON.parse(lambdaResponse.body)
        return {
          success: bodyData.success || false,
          output: bodyData.output || bodyData.stdout || '',
          stdout: bodyData.stdout || '',
          stderr: bodyData.stderr || '',
          error: bodyData.error || '',
          executionTime: bodyData.executionTime || (Date.now() - startTime)
        }
      } catch (e) {
        console.error(`Failed to parse body: ${e}`)
        return {
          success: false,
          error: 'Invalid response body from execution service',
          executionTime: Date.now() - startTime
        }
      }
    }

    return {
      success: lambdaResponse.success || false,
      output: lambdaResponse.output || lambdaResponse.stdout || '',
      stdout: lambdaResponse.stdout || '',
      stderr: lambdaResponse.stderr || '',
      error: lambdaResponse.error || '',
      executionTime: lambdaResponse.executionTime || (Date.now() - startTime)
    }

  } catch (error) {
    console.error('Execution error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return {
      success: false,
      error: `Execution failed: ${errorMessage}`,
      executionTime: Date.now() - startTime
    }
  }
}
