import { NextResponse } from 'next/server'
import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-west-2'
})

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'maximizehire-uploads-dev'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Search for the submission file across all date folders
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: 'code-assessments/'
    })

    const listResponse = await s3Client.send(listCommand)
    const files = listResponse.Contents || []

    // Find the file matching the ID
    const matchingFile = files.find(file => file.Key?.includes(id))

    if (!matchingFile || !matchingFile.Key) {
      return NextResponse.json(
        { success: false, error: 'Submission not found' },
        { status: 404 }
      )
    }

    // Fetch the submission content
    const getCommand = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: matchingFile.Key
    })

    const response = await s3Client.send(getCommand)
    const content = await response.Body?.transformToString()

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Failed to read submission' },
        { status: 500 }
      )
    }

    const submission = JSON.parse(content)

    return NextResponse.json({
      success: true,
      submission: {
        ...submission,
        id,
        key: matchingFile.Key
      }
    })

  } catch (error) {
    console.error('Error fetching submission:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch submission' },
      { status: 500 }
    )
  }
}
