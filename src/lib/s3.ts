import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-west-2'
})

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'maximizehire-uploads-dev'

interface UploadOptions {
  key: string
  body: string
  contentType: string
  metadata?: Record<string, string>
}

export async function uploadToS3({ key, body, contentType, metadata }: UploadOptions) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
    Metadata: metadata,
    ServerSideEncryption: 'AES256'
  })

  await s3Client.send(command)

  return {
    key,
    url: `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`
  }
}

// Count all assessment submissions under code-assessments/ and find the earliest
// date (from the YYYY-MM-DD key segment). Paginates for future-proofing past 1000.
export async function countAssessments(): Promise<{ total: number; sinceLabel: string }> {
  let total = 0
  let earliest: string | null = null
  let ContinuationToken: string | undefined = undefined

  do {
    const res: any = await s3Client.send(new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: 'code-assessments/',
      ContinuationToken
    }))
    for (const obj of res.Contents || []) {
      total += 1
      const m = obj.Key?.match(/code-assessments\/(\d{4}-\d{2}-\d{2})\//)
      if (m && (!earliest || m[1] < earliest)) earliest = m[1]
    }
    ContinuationToken = res.IsTruncated ? res.NextContinuationToken : undefined
  } while (ContinuationToken)

  const sinceLabel = earliest
    ? new Date(earliest + 'T00:00:00Z').toLocaleDateString('en-US', {
        month: 'long', year: 'numeric', timeZone: 'UTC'
      })
    : ''
  return { total, sinceLabel }
}

export async function getFromS3(key: string): Promise<string | null> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key
    })
    const response = await s3Client.send(command)
    return await response.Body?.transformToString() || null
  } catch (error) {
    console.error('Error fetching from S3:', error)
    return null
  }
}
