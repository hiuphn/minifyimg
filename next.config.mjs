/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Removed output: 'export' for Vercel deployment
  // Vercel handles static generation automatically
}

export default nextConfig
