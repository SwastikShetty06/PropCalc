/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const repoName = 'PropCalc';

const nextConfig = {
  output: 'export',
  // basePath and assetPrefix for GitHub Pages (only if deployed on subpath)
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
