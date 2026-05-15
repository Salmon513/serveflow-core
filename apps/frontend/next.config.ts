import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Declare monorepo root so Next.js resolves the workspace correctly
  outputFileTracingRoot: path.join(__dirname, '../../'),
};

export default nextConfig;
