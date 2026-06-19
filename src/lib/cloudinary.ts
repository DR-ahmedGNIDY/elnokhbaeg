import { v2 as cloudinary } from "cloudinary";
import { env } from "./env";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

export const UPLOAD_FOLDERS = {
  courses: "elite/courses",
  lessons: "elite/lessons",
  articles: "elite/articles",
  instructors: "elite/instructors",
  students: "elite/students",
  avatars: "elite/avatars",
} as const;

export type UploadFolder = keyof typeof UPLOAD_FOLDERS;

/**
 * Creates a signed payload the browser uses to upload directly to Cloudinary,
 * so large video files never pass through our server.
 */
export function createUploadSignature(folder: string) {
  const timestamp = Math.round(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    env.CLOUDINARY_API_SECRET,
  );
  return {
    signature,
    timestamp,
    folder,
    apiKey: env.CLOUDINARY_API_KEY,
    cloudName: env.CLOUDINARY_CLOUD_NAME,
  };
}

/** Deletes an asset by public id (best-effort). */
export async function destroyAsset(
  publicId: string,
  resourceType: "image" | "video" = "image",
) {
  if (!env.isCloudinaryEnabled() || !publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (err) {
    console.warn("[CLOUDINARY] destroy failed:", (err as Error).message);
  }
}
