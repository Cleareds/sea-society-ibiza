import { NextResponse } from "next/server";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseUrl, supabaseSecretKey, supabaseConfigured } from "@/lib/supabase/env";

export const runtime = "nodejs";

const ADMIN_EMAILS = () =>
  (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/\.[^./]+$/, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export async function POST(req: Request) {
  if (!supabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured." }, { status: 503 });
  }

  // Require an authenticated admin
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  const email = auth.user?.email?.toLowerCase();
  if (!email) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const allowed = ADMIN_EMAILS();
  if (allowed.length > 0 && !allowed.includes(email)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const fd = await req.formData();
  const file = fd.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file." }, { status: 400 });
  }
  const bucket = String(fd.get("bucket") ?? "boats");
  const scope = slugify(String(fd.get("scope") ?? "misc")) || "misc";

  const url = supabaseUrl()!;
  const secret = supabaseSecretKey();
  if (!secret) {
    return NextResponse.json(
      { error: "Server is missing SUPABASE_SECRET_KEY — uploads need it." },
      { status: 503 },
    );
  }

  const admin = createClient(url, secret, { auth: { persistSession: false } });

  // Pre-process: resize to a sane max width and re-encode to WebP. Two outputs:
  //   * <name>.webp        — full size (max 2400w) for hero / detail
  //   * <name>-thumb.webp  — 900w for cards / listings
  // Done once at upload so we never burn a Supabase image-transform credit
  // (free tier has none) or a Vercel image-optimization unit.
  const baseName = `${scope}/${Date.now()}-${slugify(file.name) || "image"}`;
  const arrayBuf = await file.arrayBuffer();

  let fullBuf: Buffer;
  let thumbBuf: Buffer;
  try {
    const input = sharp(Buffer.from(arrayBuf), { failOn: "none" }).rotate();
    fullBuf = await input
      .clone()
      .resize({ width: 2400, withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toBuffer();
    thumbBuf = await input
      .clone()
      .resize({ width: 900, withoutEnlargement: true })
      .webp({ quality: 78, effort: 5 })
      .toBuffer();
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Image processing failed." },
      { status: 415 },
    );
  }

  const fullName = `${baseName}.webp`;
  const thumbName = `${baseName}-thumb.webp`;

  const uploadOne = (path: string, body: Buffer) =>
    admin.storage.from(bucket).upload(path, body, {
      contentType: "image/webp",
      cacheControl: "31536000",
      upsert: false,
    });

  const [fullRes, thumbRes] = await Promise.all([
    uploadOne(fullName, fullBuf),
    uploadOne(thumbName, thumbBuf),
  ]);
  const upErr = fullRes.error ?? thumbRes.error;
  if (upErr) {
    return NextResponse.json({ error: upErr.message }, { status: 500 });
  }

  const { data: fullUrl } = admin.storage.from(bucket).getPublicUrl(fullName);
  const { data: thumbUrl } = admin.storage.from(bucket).getPublicUrl(thumbName);
  return NextResponse.json({
    url: fullUrl.publicUrl,
    thumbUrl: thumbUrl.publicUrl,
    path: fullName,
    bytes: { full: fullBuf.byteLength, thumb: thumbBuf.byteLength },
  });
}
