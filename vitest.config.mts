import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "node", // Or 'jsdom' if testing components. Use node for mainly server/backend core rules
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.{js,ts,jsx,tsx}", "tests/**/*.{test,spec}.{js,ts,jsx,tsx}"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});