import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// .mts because package.json has no "type": "module" and Vitest 5 is ESM-only.
// See https://vitest.dev/config/ and https://nextjs.org/docs/app/guides/testing/vitest
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Native replacement for vite-tsconfig-paths: honours "@/*" from tsconfig.json.
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    css: false,
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.d.ts", "src/test/**", "src/lib/demo-data.ts"],
      reporter: ["text", "html", "lcov"],
    },
  },
});
