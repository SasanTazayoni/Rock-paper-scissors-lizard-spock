import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/rock-paper-scissors-lizard-spock/",
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./setupTests.ts",
    restoreMocks: true,
    coverage: {
      provider: "v8",
      reporter: ["text"],
    },
  },
});
