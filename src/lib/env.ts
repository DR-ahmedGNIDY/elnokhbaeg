/**
 * Centralised, validated access to environment variables.
 * Throws early (at first import on the server) if a required var is missing,
 * so misconfiguration fails loudly instead of at a random request.
 */

function required(name: string, value: string | undefined): string {
  if (!value || value.trim() === "") {
    // During `next build` some routes are statically analysed without env.
    // We only hard-fail at runtime, so log a warning at build time.
    if (process.env.NEXT_PHASE === "phase-production-build") {
      return "";
    }
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  MONGODB_URI: required("MONGODB_URI", process.env.MONGODB_URI),
  AUTH_SECRET: required("AUTH_SECRET", process.env.AUTH_SECRET),

  GOOGLE_ID: process.env.AUTH_GOOGLE_ID ?? "",
  GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET ?? "",

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ?? "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ?? "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ?? "",

  SMTP_HOST: process.env.SMTP_HOST ?? "",
  SMTP_PORT: Number(process.env.SMTP_PORT ?? 587),
  SMTP_USER: process.env.SMTP_USER ?? "",
  SMTP_PASSWORD: process.env.SMTP_PASSWORD ?? "",
  SMTP_FROM: process.env.SMTP_FROM ?? "مؤسسة النخبة <no-reply@elite-cs.com>",

  APP_URL:
    process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000",

  isGoogleEnabled(): boolean {
    return Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);
  },
  isCloudinaryEnabled(): boolean {
    return Boolean(
      process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET,
    );
  },
  isSmtpEnabled(): boolean {
    return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER);
  },
};
