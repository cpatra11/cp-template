import withLlamaIndex from "llamaindex/next";

/** @type {import('next').NextConfig} */
const nextConfig = withLlamaIndex({
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse"],
    outputFileTracingIncludes: {
      "/*": ["./cache/**/*"],
      "/api/**/*": ["node_modules/tiktoken/tiktoken_bg.wasm"],
    },
    outputFileTracingExcludes: {
      "/api/files/*": [
        ".next/**/*",
        "node_modules/**/*",
        "public/**/*",
        "app/**/*",
      ],
    },
  },
  env: {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
  },
});

export default nextConfig;
