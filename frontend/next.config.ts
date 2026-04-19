import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // NOTE: /api/stream is handled by the Route Handler in app/api/stream/route.ts
  // which properly streams MJPEG without buffering.
  // Do NOT add a rewrite for /api/stream — rewrites buffer the body and break streaming.
};

export default nextConfig;
