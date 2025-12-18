import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

// S3 Storage credentials
const supabaseS3Url = process.env.SUPABASE_S3_URL;
const supabaseS3Region = process.env.SUPABASE_S3_REGION;
const supabaseS3AccessKeyId = process.env.SUPABASE_S3_ACCESS_KEY_ID;
const supabaseS3SecretAccessKey = process.env.SUPABASE_S3_SECRET_ACCESS_KEY;
const supabaseS3Bucket =
  process.env.SUPABASE_S3_BUCKET || "reqCHECK Questions Images";

/**
 * Create S3 client for Supabase Storage
 */
function createS3Client() {
  if (
    !supabaseS3Url ||
    !supabaseS3Region ||
    !supabaseS3AccessKeyId ||
    !supabaseS3SecretAccessKey
  ) {
    throw new Error(
      "Missing Supabase S3 environment variables. Please set SUPABASE_S3_URL, SUPABASE_S3_REGION, SUPABASE_S3_ACCESS_KEY_ID, and SUPABASE_S3_SECRET_ACCESS_KEY"
    );
  }

  return new S3Client({
    forcePathStyle: true,
    region: supabaseS3Region,
    endpoint: supabaseS3Url,
    credentials: {
      accessKeyId: supabaseS3AccessKeyId,
      secretAccessKey: supabaseS3SecretAccessKey,
    },
  });
}

/**
 * Upload an image to Supabase Storage using S3 API
 * @param file - File to upload
 * @param path - Storage path (e.g., "challenges/team-123/question-456/image.jpg")
 * @param bucket - Storage bucket name (defaults to SUPABASE_S3_BUCKET env var or "challenge-images")
 * @returns Object with url and path, or error
 */
export async function uploadImageToSupabase(
  file: File,
  path: string,
  bucket: string = supabaseS3Bucket
) {
  // Validate file type
  const validTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  if (!validTypes.includes(file.type)) {
    return {
      error: `Invalid file type. Allowed types: ${validTypes.join(", ")}`,
    };
  }

  // Validate file size (max 2MB)
  const maxSize = 2 * 1024 * 1024; // 2MB
  if (file.size > maxSize) {
    return {
      error: "File size exceeds 2MB limit",
    };
  }

  try {
    const s3Client = createS3Client();

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: path,
      Body: buffer,
      ContentType: file.type,
      CacheControl: "3600",
    });

    await s3Client.send(command);

    // Construct public URL directly from S3 endpoint
    const publicUrl = getPublicUrl(bucket, path);

    return {
      url: publicUrl,
      path: path,
    };
  } catch (error: any) {
    // Provide more helpful error messages
    let errorMessage = error.message || "Failed to upload image";

    if (
      errorMessage.includes("NoSuchBucket") ||
      errorMessage.includes("bucket was not found")
    ) {
      errorMessage = `Bucket "${bucket}" not found. Please create the bucket "${bucket}" in your Supabase Storage dashboard, or set SUPABASE_S3_BUCKET to an existing bucket name.`;
    } else if (
      errorMessage.includes("AccessDenied") ||
      errorMessage.includes("Forbidden")
    ) {
      errorMessage = `Access denied to bucket "${bucket}". Please check your S3 credentials and bucket permissions.`;
    }

    return {
      error: errorMessage,
    };
  }
}

/**
 * Delete an image from Supabase Storage using S3 API
 */
export async function deleteImageFromSupabase(
  path: string,
  bucket: string = supabaseS3Bucket
) {
  try {
    const s3Client = createS3Client();

    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: path,
    });

    await s3Client.send(command);

    return { success: true };
  } catch (error: any) {
    return {
      error: error.message || "Failed to delete image",
    };
  }
}

/**
 * Generate a public URL for a Supabase Storage object
 * Constructs URL from S3 endpoint URL
 */
function getPublicUrl(bucket: string, path: string): string {
  if (!supabaseS3Url) {
    throw new Error("SUPABASE_S3_URL is required to generate public URLs");
  }

  // Convert S3 endpoint to public URL format
  // S3 URL: https://project_ref.storage.supabase.co/storage/v1/s3
  // Public URL: https://project_ref.supabase.co/storage/v1/object/public/{bucket}/{path}
  const publicUrl = supabaseS3Url
    .replace(
      ".storage.supabase.co/storage/v1/s3",
      ".supabase.co/storage/v1/object/public"
    )
    .replace("/storage/v1/s3", "/storage/v1/object/public");

  return `${publicUrl}/${bucket}/${path}`;
}

/**
 * Generate a storage path for a challenge question image
 */
export function generateChallengeImagePath(
  teamId: number,
  questionId: string,
  filename: string
): string {
  // Extract extension from filename
  const extension = filename.split(".").pop() || "jpg";
  // Generate unique filename with timestamp
  const timestamp = Date.now();
  const sanitizedFilename = filename
    .replace(/[^a-zA-Z0-9.-]/g, "_")
    .toLowerCase();
  return `challenges/team-${teamId}/question-${questionId}/${timestamp}-${sanitizedFilename}`;
}
