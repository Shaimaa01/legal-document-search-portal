const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
  },
};

export default config;
