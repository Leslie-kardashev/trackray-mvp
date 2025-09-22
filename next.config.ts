import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  output: 'export', // Add this line
  /* ... other config ... */
  images: {
    unoptimized: true // Necessary for static export with next/image
  }
};


export default nextConfig;
