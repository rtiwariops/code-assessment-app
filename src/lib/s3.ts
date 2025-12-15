import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

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
