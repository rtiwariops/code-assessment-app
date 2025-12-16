import { NextResponse } from 'next/server'
import { uploadToS3 } from '@/lib/s3'
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns'

const snsClient = new SNSClient({
  region: process.env.AWS_REGION || 'us-west-2'
})

async function sendSMSNotification(language: string, uuid: string) {
  const phoneNumber = process.env.RECRUITER_PHONE
  if (!phoneNumber) {
    console.log('No RECRUITER_PHONE configured, skipping SMS')
    return
  }

  try {
    const reviewUrl = `https://code.maximizehire.ai/review/${uuid}`
    const message = `New code submission!\nLanguage: ${language}\nReview: ${reviewUrl}`

    await snsClient.send(new PublishCommand({
      PhoneNumber: phoneNumber,
      Message: message
    }))
    console.log('SMS notification sent successfully')
  } catch (error) {
    console.error('Failed to send SMS:', error)
    // Don't throw - SMS failure shouldn't fail the submission
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

    // Send SMS notification (non-blocking)
    sendSMSNotification(language, uuid)

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
