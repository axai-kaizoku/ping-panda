import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev"

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

if (process.env.NODE_ENV === "development") {
  await setupDevPlatform()
}

export default nextConfig
