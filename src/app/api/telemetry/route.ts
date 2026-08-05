import { NextResponse } from "next/server";

// Never cache — this proxies live admin reads.
export const dynamic = "force-dynamic";

const WORKER_URL =
  process.env.TELEMETRY_WORKER_URL ?? "https://telemetry.dgwaynes.com";

type Body = { password?: string };

/**
 * Server-side proxy for the telemetry dashboard.
 *
 * Holds BOTH secrets server-side so the browser never sees either:
 *   - ADMIN_PASSWORD             the gate the page posts its password to
 *                                (shared with the announcements admin).
 *   - TELEMETRY_ADMIN_SECRET     the bearer token the Worker requires.
 *   - TELEMETRY_WORKER_URL       the Worker origin (defaults to prod).
 *
 * POST { password } -> full stats payload from the Worker's /admin/stats.
 */
export async function POST(req: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminSecret = process.env.TELEMETRY_ADMIN_SECRET;
  if (!adminPassword || !adminSecret) {
    return NextResponse.json(
      { error: "server_not_configured" },
      { status: 500 },
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  if (!body.password || body.password !== adminPassword) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(`${WORKER_URL}/admin/stats`, {
      headers: { authorization: `Bearer ${adminSecret}` },
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "worker_unreachable" }, { status: 502 });
  }
}
