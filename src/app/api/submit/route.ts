import { NextResponse } from 'next/server'
import { uploadToS3 } from '@/lib/s3'
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION || 'us-west-2'
})

async function sendEmailNotification(
  language: string,
  uuid: string,
  accessCode: string,
  riskScore: 'low' | 'medium' | 'high' = 'low',
  aiLikelihood: number | null = null
) {
  const recipientEmail = process.env.RECRUITER_EMAIL
  if (!recipientEmail) {
    console.log('No RECRUITER_EMAIL configured, skipping email')
    return
  }

  try {
    const reviewUrl = `https://code.maximizehire.ai/review/${uuid}`
    const riskColor = riskScore === 'high' ? '#dc2626' : riskScore === 'medium' ? '#d97706' : '#16a34a'
    const aiText = aiLikelihood !== null ? ` · AI-likelihood ${aiLikelihood}%` : ''

    await sesClient.send(new SendEmailCommand({
      Source: 'noreply@maximizehire.ai',
      Destination: {
        ToAddresses: [recipientEmail]
      },
      Message: {
        Subject: {
          Data: `New Code Submission - ${language.toUpperCase()}`
        },
        Body: {
          Html: {
            Data: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #7c3aed;">New Code Assessment Submission</h2>
                <p>A candidate has submitted their code assessment.</p>
                <table style="margin: 20px 0;">
                  <tr><td style="padding: 8px 16px 8px 0; color: #666;">Language:</td><td style="font-weight: bold;">${language.toUpperCase()}</td></tr>
                  <tr><td style="padding: 8px 16px 8px 0; color: #666;">Access Code:</td><td style="font-family: monospace;">${accessCode}</td></tr>
                  <tr><td style="padding: 8px 16px 8px 0; color: #666;">Time:</td><td>${new Date().toLocaleString()}</td></tr>
                  <tr><td style="padding: 8px 16px 8px 0; color: #666;">Integrity:</td><td style="font-weight: bold; color: ${riskColor};">${riskScore.toUpperCase()} risk${aiText}</td></tr>
                </table>
                <a href="${reviewUrl}" style="display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">Review Submission</a>
                <p style="margin-top: 24px; color: #666; font-size: 14px;">Or copy this link: ${reviewUrl}</p>
              </div>
            `
          },
          Text: {
            Data: `New Code Submission\n\nLanguage: ${language}\nAccess Code: ${accessCode}\nIntegrity: ${riskScore.toUpperCase()} risk${aiText}\n\nReview: ${reviewUrl}`
          }
        }
      }
    }))
    console.log('Email notification sent successfully')
  } catch (error) {
    console.error('Failed to send email:', error)
  }
}

// AI-generated / plagiarism heuristic. Fail-open: returns null on any error or when
// no OPENAI_API_KEY is set, so a submission is NEVER blocked by this check.
async function checkAiLikelihood(
  code: string,
  language: string
): Promise<{ aiLikelihood: number; reasoning: string } | null> {
  const key = process.env.OPENAI_API_KEY
  if (!key) return null
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.2,
        max_tokens: 300,
        messages: [
          {
            role: 'system',
            content:
              'You assess whether submitted code appears AI-generated or copied from common sources. Respond with JSON only.',
          },
          {
            role: 'user',
            content: `Language: ${language}\n\nCode:\n${code.slice(0, 6000)}\n\nRespond with JSON only: {"aiLikelihood": <0-100 integer>, "reasoning": "<one or two sentences>"}`,
          },
        ],
      }),
    })
    if (!res.ok) return null
    const data = await res.json()
    const raw: string = data?.choices?.[0]?.message?.content?.trim() || ''
    const match = raw.match(/\{[\s\S]*\}/) // tolerate ```json fences / prose
    if (!match) return null
    const parsed = JSON.parse(match[0])
    return {
      aiLikelihood: Math.max(0, Math.min(100, Number(parsed.aiLikelihood) || 0)),
      reasoning: String(parsed.reasoning || ''),
    }
  } catch {
    return null
  }
}

// Composite risk from behavioural telemetry + AI-likelihood. Advisory only.
function computeRisk(
  telemetry: any,
  aiLikelihood: number | null
): 'low' | 'medium' | 'high' {
  let score = 0
  if (telemetry) {
    const tabs = telemetry.tabSwitches || 0
    if (tabs >= 3) score += 2
    else if (tabs >= 1) score += 1
    const largest = telemetry.largestPaste || 0
    if (largest >= 200) score += 2
    else if ((telemetry.pasteCount || 0) >= 1) score += 1
    if (telemetry.durationMs > 0 && telemetry.durationMs < 60000) score += 1
  }
  if (aiLikelihood !== null) {
    if (aiLikelihood >= 75) score += 3
    else if (aiLikelihood >= 50) score += 1
  }
  if (score >= 4) return 'high'
  if (score >= 2) return 'medium'
  return 'low'
}

export async function POST(request: Request) {
  try {
    const { code, language, output, accessCode, telemetry } = await request.json()

    if (!code || !language) {
      return NextResponse.json(
        { success: false, error: 'Code and language are required' },
        { status: 400 }
      )
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') || 'unknown'

    // Integrity scoring (fail-open — never blocks the submission)
    const integrity = await checkAiLikelihood(code, language)
    const riskScore = computeRisk(telemetry, integrity?.aiLikelihood ?? null)

    const submission = {
      code,
      language,
      output: output || '',
      accessCode: accessCode || 'unknown',
      timestamp: new Date().toISOString(),
      ip,
      userAgent: request.headers.get('user-agent') || 'unknown',
      telemetry: telemetry || null,
      integrity: integrity || null,
      riskScore
    }

    const date = new Date().toISOString().split('T')[0]
    const uuid = crypto.randomUUID()
    const key = `code-assessments/${date}/${uuid}.json`

    await uploadToS3({
      key,
      body: JSON.stringify(submission, null, 2),
      contentType: 'application/json',
      metadata: {
        'access-code': accessCode || 'unknown',
        'language': language,
        'risk-score': riskScore,
        'tab-switches': String(telemetry?.tabSwitches ?? 0),
        'paste-count': String(telemetry?.pasteCount ?? 0)
      }
    })

    // Send email notification (with an integrity flag line)
    await sendEmailNotification(language, uuid, accessCode || 'unknown', riskScore, integrity?.aiLikelihood ?? null)

    return NextResponse.json({
      success: true,
      submissionId: uuid,
      key,
      timestamp: submission.timestamp
    })

  } catch (error) {
    console.error('Submit error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save submission' },
      { status: 500 }
    )
  }
}
