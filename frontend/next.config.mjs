/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "localhost",
      },
      {
        hostname: "lh3.googleusercontent.com"
      }
    ],
  },
};

export default nextConfig;
