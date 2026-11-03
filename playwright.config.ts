import { defineConfig } from "@playwright/test";

/**
 * QA: `npm run build && npm run test:e2e`
 * Ortamda önceden kurulu Chromium varsa PLAYWRIGHT_CHROMIUM_PATH ile gösterilebilir.
 */
const port = Number(process.env.PORT ?? 3100);

export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  fullyParallel: true,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  use: {
    baseURL: `http://localhost:${port}`,
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH } : {},
  },
  webServer: {
    command: `npx next start -p ${port}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
