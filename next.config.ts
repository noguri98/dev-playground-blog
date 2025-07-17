import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NOTE_PATH: process.env.NOTE_PATH,
  },
};

export default nextConfig;
