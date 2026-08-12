import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [360, 640, 828, 1080, 1440],
    },
    experimental: {
        optimizePackageImports: ['@heroicons/react', 'gsap'],
    },
};

export default nextConfig;
