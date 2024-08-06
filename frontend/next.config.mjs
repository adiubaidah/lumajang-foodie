/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname:
          process.env.NODE_ENV === "development"
            ? "localhost"
            : "api.lumajangfoodie.com",
      },
      {
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/i,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
