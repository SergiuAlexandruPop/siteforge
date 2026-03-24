import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

// ---------------------------------------------------------------------------
// Cloudflare R2 — S3-compatible image storage
// ---------------------------------------------------------------------------
// Each client has its own bucket. R2 is configured via env vars.
// Uses the AWS SDK v3 S3 client since R2 is S3-compatible.
// ---------------------------------------------------------------------------

function getR2Client(): S3Client {
  const accountId = process.env.R2_ACCOUNT_ID
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      'Missing R2 environment variables. Required: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY'
    )
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  })
}

function getBucketName(): string {
  const bucket = process.env.R2_BUCKET_NAME
  if (!bucket) {
    throw new Error('R2_BUCKET_NAME environment variable is not set.')
  }
  return bucket
}

function getPublicUrl(): string {
  const url = process.env.R2_PUBLIC_URL
  if (!url) {
    throw new Error('R2_PUBLIC_URL environment variable is not set.')
  }
  // Remove trailing slash if present
  return url.replace(/\/$/, '')
}

/**
 * Upload a file to R2 and return the public URL.
 *
 * @param key - The object key (filename) in the bucket, e.g. "blog/my-image.webp"
 * @param body - The file contents as a Buffer
 * @param contentType - MIME type, e.g. "image/webp"
 * @returns The public URL of the uploaded file
 */
export async function uploadToR2(
  key: string,
  body: Buffer,
  contentType: string
): Promise<string> {
  const client = getR2Client()
  const bucket = getBucketName()

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  )

  return `${getPublicUrl()}/${key}`
}

/**
 * Delete a file from R2 by its key.
 *
 * @param key - The object key to delete, e.g. "blog/my-image.webp"
 */
export async function deleteFromR2(key: string): Promise<void> {
  const client = getR2Client()
  const bucket = getBucketName()

  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  )
}
