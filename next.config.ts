import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* ... other config ... */
  output: 'export',
  images: {
    unoptimized: true
  }
};


export default nextConfig;
