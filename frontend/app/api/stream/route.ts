import { NextRequest } from "next/server";

// Runtime must be nodejs – edge runtime can't handle long-lived MJPEG streams
export const runtime = "nodejs";
// Do NOT cache this route
export const dynamic = "force-dynamic";

const FLASK = process.env.NEXT_PUBLIC_FLASK_URL || "http://localhost:5000";

export async function GET(_req: NextRequest) {
  let upstream: Response;
  try {
    upstream = await fetch(`${FLASK}/api/stream`, {
      headers: {
        Accept: "multipart/x-mixed-replace, */*",
        Connection: "keep-alive",
      },
      // @ts-expect-error – Node fetch supports duplex
      duplex: "half",
      // No timeout — this is a long-lived streaming response
      signal: undefined,
    });
  } catch (err) {
    console.error("[stream proxy] fetch failed:", err);
    return new Response("Stream unavailable — backend not reachable", { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    return new Response(`Stream unavailable (upstream ${upstream.status})`, { status: 502 });
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type":
        upstream.headers.get("Content-Type") ??
        "multipart/x-mixed-replace; boundary=frame",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
      "X-Accel-Buffering": "no",       // Disable Nginx buffering
      "Transfer-Encoding": "chunked",  // Ensure chunks are flushed immediately
    },
  });
}
