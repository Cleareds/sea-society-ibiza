/**
 * Read + write the `integrations` table. Always goes through the
 * service-role client because the table is locked off from anon.
 *
 * Each integration is a row keyed by a stable id (e.g. 'instagram').
 * The shape of the `config` jsonb is integration-specific — see the
 * per-integration types below.
 */
import { createSupabaseAdminClient, adminClientAvailable } from "./supabase/admin";

export interface InstagramConfig {
  accessToken?: string;
  userId?: string;
  username?: string;
  /** ISO 8601 expiry timestamp returned by the long-lived token exchange. */
  expiresAt?: string;
  /** When the row was last refreshed by us. */
  refreshedAt?: string;
}

interface IntegrationRow {
  id: string;
  config: Record<string, unknown>;
  updated_at: string | null;
}

export async function getInstagramConfig(): Promise<InstagramConfig | null> {
  if (!adminClientAvailable()) return null;
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("integrations")
    .select("id,config,updated_at")
    .eq("id", "instagram")
    .returns<IntegrationRow[]>()
    .maybeSingle();
  if (error || !data) return null;
  return data.config as InstagramConfig;
}

export async function setInstagramConfig(
  patch: Partial<InstagramConfig>,
): Promise<void> {
  if (!adminClientAvailable()) {
    throw new Error("Supabase admin client not configured.");
  }
  const supabase = createSupabaseAdminClient();
  const existing = (await getInstagramConfig()) ?? {};
  const next: InstagramConfig = { ...existing, ...patch };
  const row = {
    id: "instagram",
    config: next as unknown as Record<string, unknown>,
    updated_at: new Date().toISOString(),
  };
  const { error } = await (supabase.from("integrations") as unknown as {
    upsert: (
      v: typeof row,
      o: { onConflict: string },
    ) => Promise<{ error: { message: string } | null }>;
  }).upsert(row, { onConflict: "id" });
  if (error) throw error;
}

export async function clearInstagramConfig(): Promise<void> {
  if (!adminClientAvailable()) return;
  const supabase = createSupabaseAdminClient();
  await (supabase.from("integrations") as unknown as {
    update: (v: Record<string, unknown>) => {
      eq: (col: string, val: string) => Promise<unknown>;
    };
  })
    .update({ config: {}, updated_at: new Date().toISOString() })
    .eq("id", "instagram");
}
