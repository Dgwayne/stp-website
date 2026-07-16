import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Content types we accept, mapped to the extension we store under.
const ALLOWED: Record<string, string> = {
  "image/gif": "gif",
  "image/webp": "webp",
  "image/png": "png",
  "image/jpeg": "jpg",
};
// Vercel serverless request bodies cap around 4.5 MB, so keep uploads under
// that. Announcement GIFs should be small anyway (they load on app launch).
const MAX_BYTES = 4.5 * 1024 * 1024;

function env(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim() ? v.trim() : undefined;
}

/**
 * Uploads a GIF/WebP/PNG/JPEG to the Backblaze bucket that serves
 * models.dgwaynes.com, and returns its public URL for the editor to insert
 * inline. Auth reuses ADMIN_PASSWORD (sent by the editor as a header). All B2
 * credentials stay server-side.
 */
export async function POST(req: Request) {
  const adminPassword = env("ADMIN_PASSWORD");
  const endpoint = env("B2_S3_ENDPOINT");
  const region = env("B2_REGION");
  const bucket = env("B2_BUCKET");
  const keyId = env("B2_KEY_ID");
  const appKey = env("B2_APP_KEY");
  const publicBase = env("B2_PUBLIC_BASE");

  if (!adminPassword) {
    return NextResponse.json(
      { error: "server_not_configured" },
      { status: 500 },
    );
  }
  if (req.headers.get("x-admin-password") !== adminPassword) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!endpoint || !region || !bucket || !keyId || !appKey || !publicBase) {
    return NextResponse.json(
      { error: "upload_not_configured" },
      { status: 500 },
    );
  }

  let file: File | null = null;
  try {
    const form = await req.formData();
    const f = form.get("file");
    if (f instanceof File) file = f;
  } catch {
    return NextResponse.json({ error: "bad_form" }, { status: 400 });
  }
  if (!file) return NextResponse.json({ error: "no_file" }, { status: 400 });

  const ext = ALLOWED[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: `unsupported_type: ${file.type || "unknown"}` },
      { status: 415 },
    );
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (bytes.byteLength > MAX_BYTES) {
    return NextResponse.json(
      { error: `too_large (max ${Math.round(MAX_BYTES / 1024 / 1024)} MB)` },
      { status: 413 },
    );
  }

  const base =
    (file.name || "image")
      .toLowerCase()
      .replace(/\.[a-z0-9]+$/i, "")
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "image";
  const key = `announcements/img/${Date.now()}-${base}.${ext}`;

  const s3 = new S3Client({
    endpoint,
    region,
    forcePathStyle: true, // B2 S3-compatible endpoint
    credentials: { accessKeyId: keyId, secretAccessKey: appKey },
  });

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: bytes,
        ContentType: file.type,
        // Keys are unique per upload, so cache forever at the edge.
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );
  } catch (e) {
    return NextResponse.json(
      { error: "upload_failed", detail: String(e) },
      { status: 502 },
    );
  }

  const url = `${publicBase.replace(/\/+$/, "")}/${key}`;
  return NextResponse.json({ url });
}
