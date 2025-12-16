import { NextResponse } from 'next/server'
import { uploadToS3 } from '@/lib/s3'
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION || 'us-west-2'
})

async function sendEmailNotification(language: string, uuid: string, accessCode: string) {
  const recipientEmail = process.env.RECRUITER_EMAIL
  if (!recipientEmail) {
    console.log('No RECRUITER_EMAIL configured, skipping email')
    return
  }

  try {
    const reviewUrl = `https://code.maximizehire.ai/review/${uuid}`

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
                </table>
                <a href="${reviewUrl}" style="display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">Review Submission</a>
                <p style="margin-top: 24px; color: #666; font-size: 14px;">Or copy this link: ${reviewUrl}</p>
              </div>
            `
          },
          Text: {
            Data: `New Code Submission\n\nLanguage: ${language}\nAccess Code: ${accessCode}\n\nReview: ${reviewUrl}`
          }
        }
      }
    }))
    console.log('Email notification sent successfully')
  } catch (error) {
    console.error('Failed to send email:', error)
  }
}

export async function POST(request: Request) {
  try {
    const { code, language, output, accessCode } = await request.json()

    if (!code || !language) {
      return NextResponse.json(
        { success: false, error: 'Code and language are required' },
        { status: 400 }
      )
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') || 'unknown'

    const submission = {
      code,
      language,
      output: output || '',
      accessCode: accessCode || 'unknown',
      timestamp: new Date().toISOString(),
      ip,
      userAgent: request.headers.get('user-agent') || 'unknown'
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
        'language': language
      }
    })

    // Send email notification (non-blocking)
    sendEmailNotification(language, uuid, accessCode || 'unknown')

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
