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

const lambdaClient = new LambdaClient({
  region: process.env.AWS_REGION || 'us-west-2'
})

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
    const functionName = LAMBDA_FUNCTIONS[language]

    const payload = {
      code: Buffer.from(code).toString('base64'),
      isFinalSubmission: 'false',
      requestAIValidation: 'false'
    }

    const command = new InvokeCommand({
      FunctionName: functionName,
      Payload: JSON.stringify(payload),
      InvocationType: 'RequestResponse'
    })

    const response = await lambdaClient.send(command)

    if (response.FunctionError) {
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
    let lambdaResponse

    try {
      lambdaResponse = JSON.parse(responseString)
    } catch {
      return {
        success: false,
        error: 'Invalid response from execution service',
        executionTime: Date.now() - startTime
      }
    }

    // Handle Lambda response
    if (lambdaResponse.statusCode && lambdaResponse.body) {
      const bodyData = JSON.parse(lambdaResponse.body)
      return {
        success: bodyData.success || false,
        output: bodyData.output || bodyData.stdout || '',
        stdout: bodyData.stdout || '',
        stderr: bodyData.stderr || '',
        error: bodyData.error || '',
        executionTime: bodyData.executionTime || (Date.now() - startTime)
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
    return {
      success: false,
      error: `Execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      executionTime: Date.now() - startTime
    }
  }
}
