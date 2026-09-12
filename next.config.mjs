/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  ...(isProd ? { output: 'export' } : {}),
  basePath: isProd ? (process.env.NEXT_PUBLIC_BASE_PATH || '') : '',
  assetPrefix: isProd ? (process.env.NEXT_PUBLIC_BASE_PATH || '') : '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
