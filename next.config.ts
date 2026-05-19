/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
    // Ini akan membuat ESLint hanya memberi peringatan, bukan error
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Juga abaikan error TypeScript saat build (opsional)
    ignoreBuildErrors: true,
  },
  
  images: {
    dangerouslyAllowSVG: true,  // ← Tambahkan ini
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'fjoqahnkddquarfratlj.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
}


module.exports = nextConfig