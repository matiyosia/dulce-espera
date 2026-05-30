import withPWA from "next-pwa";

const pwaConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Esto hace que el build no falle aunque tengas errores de tipos
    ignoreBuildErrors: true,
  },
};

export default pwaConfig(nextConfig);
