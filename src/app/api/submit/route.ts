import { NextResponse } from 'next/server'
import { uploadToS3 } from '@/lib/s3'

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
