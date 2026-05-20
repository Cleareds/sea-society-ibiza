import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { enquirySchema } from "@/lib/schemas";
import { createEnquiry } from "@/lib/data";

export const runtime = "nodejs";

const RATE_LIMIT: Map<string, { count: number; reset: number }> = (
  globalThis as unknown as { __ssiRate?: Map<string, { count: number; reset: number }> }
).__ssiRate ?? new Map();
(globalThis as unknown as { __ssiRate?: typeof RATE_LIMIT }).__ssiRate = RATE_LIMIT;

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function rateLimit(ip: string) {
  const now = Date.now();
  const entry = RATE_LIMIT.get(ip);
  if (!entry || entry.reset < now) {
    RATE_LIMIT.set(ip, { count: 1, reset: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_PER_WINDOW) return false;
  entry.count += 1;
  return true;
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (!rateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  // Honeypot — silently accept and discard.
  if (parsed.data.website && parsed.data.website.length > 0) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const { website: _honey, ...input } = parsed.data;
  void _honey;

  try {
    await createEnquiry({
      ...input,
      groupSize: input.groupSize,
    });

    // When running in dummy mode, persist to a tmp file so admin/log workflows
    // can read submissions locally.
    if (process.env.USE_SUPABASE !== "true") {
      try {
        const path = join(tmpdir(), "ssi-enquiries.json");
        let existing: unknown[] = [];
        try {
          const buf = await fs.readFile(path, "utf8");
          existing = JSON.parse(buf);
        } catch {
          // file doesn't exist yet
        }
        existing.push({ ...input, ip, receivedAt: new Date().toISOString() });
        await fs.writeFile(path, JSON.stringify(existing, null, 2));
      } catch (e) {
        console.error("[enquiries] tmp log failed", e);
      }
    }

    // TODO: Resend email when RESEND_API_KEY is set.

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[enquiries] create failed", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
