import withPWA from "next-pwa";

const pwaConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = {
  turbopack: {},
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default pwaConfig(nextConfig);
