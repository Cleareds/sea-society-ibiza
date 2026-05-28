import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getInstagramConfig } from "@/lib/integrations";
import { oauthConfigured, getOauthEnv } from "@/lib/instagram-oauth";
import {
  startInstagramConnect,
  refreshInstagramToken,
  disconnectInstagram,
} from "./actions";

// Developer escape-hatch — emails that can see the destructive
// Connect / Reconnect / Disconnect actions. Everyone else sees the
// status + "Refresh now" only. Empty list means nobody is gated and
// the dangerous buttons are hidden universally — only the database
// (or env var change) can reset the integration.
function developerEmails(): string[] {
  return (process.env.DEVELOPER_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

async function isDeveloper(): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const email = data.user?.email?.toLowerCase();
  if (!email) return false;
  const allowed = developerEmails();
  return allowed.includes(email);
}

export const metadata: Metadata = {
  title: "Integrations — Admin",
  robots: { index: false, follow: false },
};

const fmt = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function daysUntil(iso: string | undefined): number | null {
  if (!iso) return null;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return null;
  return Math.round((t - Date.now()) / 86_400_000);
}

export default async function IntegrationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; detail?: string }>;
}) {
  const sp = await searchParams;
  const cfg = await getInstagramConfig();
  const oauthOk = oauthConfigured();
  const { appId, redirectUri } = getOauthEnv();
  const connected = Boolean(cfg?.accessToken && cfg?.userId);
  const days = daysUntil(cfg?.expiresAt);
  const dev = await isDeveloper();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-on-surface-variant)]">
          Connections
        </p>
        <h1 className="mt-2 font-serif text-4xl">Integrations</h1>
      </div>

      {sp.status && <FlashBanner status={sp.status} detail={sp.detail} />}

      <section className="rounded-2xl bg-[var(--color-surface)] p-6 md:p-8">
        <header className="flex items-baseline justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl">Instagram</h2>
            <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">
              Drives the live feed on the homepage preview.
            </p>
          </div>
          <StatusBadge connected={connected} days={days} />
        </header>

        {!oauthOk && <EnvMissingNotice appId={appId} redirectUri={redirectUri} />}

        {oauthOk && !connected && dev && (
          <div className="mt-6 space-y-4">
            <p className="text-sm">
              Click <strong>Connect Instagram</strong> below, log in to the
              IG account you want to feature, and approve access. We&rsquo;ll
              store a 60-day token and refresh it automatically.
            </p>
            <form action={startInstagramConnect}>
              <button
                type="submit"
                className="rounded-full bg-[var(--color-primary)] px-6 py-2 text-sm font-medium text-white"
              >
                Connect Instagram
              </button>
            </form>
          </div>
        )}
        {oauthOk && !connected && !dev && (
          <p className="mt-6 text-sm text-[var(--color-on-surface-variant)]">
            Instagram isn&rsquo;t connected yet. The developer team needs
            to do the initial connection — once they have, this page will
            show the live status.
          </p>
        )}

        {connected && (
          <div className="mt-6 space-y-4">
            <dl className="grid gap-4 sm:grid-cols-2">
              <Field label="Connected as" value={cfg?.username ? `@${cfg.username}` : "—"} />
              <Field label="User ID" value={cfg?.userId ?? "—"} />
              <Field
                label="Token expires"
                value={cfg?.expiresAt ? `${fmt.format(new Date(cfg.expiresAt))} (${days}d)` : "—"}
              />
              <Field
                label="Last refresh"
                value={cfg?.refreshedAt ? fmt.format(new Date(cfg.refreshedAt)) : "—"}
              />
            </dl>
            <div className="flex flex-wrap gap-3 pt-4">
              <form action={refreshInstagramToken}>
                <button
                  type="submit"
                  className="rounded-full border border-[var(--color-outline)] px-5 py-2 text-sm hover:bg-[var(--color-surface-container)]"
                >
                  Refresh token now
                </button>
              </form>
              {dev && (
                <>
                  <form action={startInstagramConnect}>
                    <button
                      type="submit"
                      className="rounded-full border border-[var(--color-outline)] px-5 py-2 text-sm hover:bg-[var(--color-surface-container)]"
                    >
                      Reconnect (different account)
                    </button>
                  </form>
                  <form action={disconnectInstagram}>
                    <button
                      type="submit"
                      className="rounded-full border border-[var(--color-outline)] px-5 py-2 text-sm text-[var(--color-secondary)] hover:bg-[var(--color-surface-container)]"
                    >
                      Disconnect
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </section>

      <section className="rounded-2xl bg-[var(--color-surface)] p-6 text-sm text-[var(--color-on-surface-variant)]">
        <h3 className="text-xs uppercase tracking-[0.25em] text-[var(--color-on-surface)]">
          Setup checklist
        </h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          <li>Instagram account is set to <strong>Public</strong> (Settings → Privacy).</li>
          <li>Instagram account is a <strong>Creator</strong> or <strong>Business</strong> account (Settings → Account type and tools → Switch to professional account).</li>
          <li>
            Meta app created at <code>developers.facebook.com</code>, Instagram product added,
            redirect URI set to <code>{redirectUri ?? "https://YOUR-DOMAIN/api/admin/instagram/callback"}</code>.
          </li>
          <li>
            Env vars set in Vercel:
            <code className="ml-1">INSTAGRAM_APP_ID</code>,{" "}
            <code>INSTAGRAM_APP_SECRET</code>,{" "}
            <code>INSTAGRAM_REDIRECT_URI</code>,{" "}
            <code>CRON_SECRET</code> (any random string — used by the monthly refresh).
          </li>
          <li>
            Add to <code>vercel.json</code>:
            <pre className="mt-2 overflow-x-auto rounded-lg bg-black/5 p-3 text-xs">
{`{
  "crons": [
    {
      "path": "/api/admin/instagram/refresh?secret=YOUR_CRON_SECRET",
      "schedule": "0 4 1 * *"
    }
  ]
}`}
            </pre>
            (Runs at 04:00 UTC on the 1st of each month — well before the 60-day token expiry.)
          </li>
        </ol>
      </section>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
        {label}
      </dt>
      <dd className="mt-1 break-all text-sm">{value}</dd>
    </div>
  );
}

function StatusBadge({ connected, days }: { connected: boolean; days: number | null }) {
  if (!connected) {
    return (
      <span className="rounded-full bg-[var(--color-outline-variant)] px-3 py-1 text-xs uppercase tracking-[0.15em] text-[var(--color-on-surface-variant)]">
        Not connected
      </span>
    );
  }
  const warn = days !== null && days < 14;
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.15em] ${
        warn
          ? "bg-[var(--color-secondary)]/15 text-[var(--color-secondary)]"
          : "bg-[var(--color-primary)]/15 text-[var(--color-primary)]"
      }`}
    >
      {warn ? `Renew soon (${days}d)` : "Live"}
    </span>
  );
}

function FlashBanner({ status, detail }: { status: string; detail?: string }) {
  const map: Record<string, { tone: "ok" | "err"; msg: string }> = {
    connected: { tone: "ok", msg: detail ? `Connected as @${detail}.` : "Connected." },
    refreshed: { tone: "ok", msg: "Token refreshed." },
    disconnected: { tone: "ok", msg: "Disconnected." },
    error: { tone: "err", msg: detail ? `Error: ${detail}` : "Error." },
  };
  const cfg = map[status];
  if (!cfg) return null;
  return (
    <div
      className={`rounded-lg px-4 py-3 text-sm ${
        cfg.tone === "ok"
          ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
          : "bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]"
      }`}
    >
      {cfg.msg}
    </div>
  );
}

function EnvMissingNotice({
  appId,
  redirectUri,
}: {
  appId: string | undefined;
  redirectUri: string | undefined;
}) {
  return (
    <div className="mt-6 rounded-lg bg-[var(--color-secondary)]/10 p-4 text-sm text-[var(--color-secondary)]">
      <p className="font-medium">OAuth env vars missing on the server.</p>
      <p className="mt-2">
        Set <code>INSTAGRAM_APP_ID</code>, <code>INSTAGRAM_APP_SECRET</code>, and{" "}
        <code>INSTAGRAM_REDIRECT_URI</code> in Vercel (or .env.local) and redeploy.
        Currently detected: appId={appId ? "✓" : "✗"}, redirectUri={redirectUri ? "✓" : "✗"}.
      </p>
    </div>
  );
}
