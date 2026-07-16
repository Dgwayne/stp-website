import { NextResponse } from "next/server";

// Never cache — this proxies live admin reads/writes.
export const dynamic = "force-dynamic";

const WORKER_URL =
  process.env.ANNOUNCEMENTS_WORKER_URL ?? "https://announcements.dgwaynes.com";

type Body = {
  action?: "load" | "publish";
  password?: string;
  announcements?: unknown;
};

/**
 * Server-side proxy for the announcements admin page.
 *
 * Holds BOTH secrets server-side so the browser never sees either:
 *   - ADMIN_PASSWORD                the gate the page posts its password to.
 *   - ANNOUNCEMENTS_ADMIN_SECRET    the bearer token the Worker requires.
 *   - ANNOUNCEMENTS_WORKER_URL      the Worker origin (defaults to prod).
 *
 * POST { action: "load" }               -> current stored announcements JSON
 * POST { action: "publish", announcements: [...] } -> replace the list
 */
export async function POST(req: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminSecret = process.env.ANNOUNCEMENTS_ADMIN_SECRET;
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

  const headers = {
    authorization: `Bearer ${adminSecret}`,
    "content-type": "application/json",
  };

  try {
    const isPublish = body.action === "publish";
    const res = await fetch(`${WORKER_URL}/admin`, {
      method: isPublish ? "PUT" : "GET",
      headers,
      cache: "no-store",
      body: isPublish
        ? JSON.stringify({ announcements: body.announcements ?? [] })
        : undefined,
    });
    // Pass the Worker's status + JSON straight through so the page can show
    // its validation errors verbatim.
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    return NextResponse.json(
      { error: "worker_unreachable", detail: String(e) },
      { status: 502 },
    );
  }
}
