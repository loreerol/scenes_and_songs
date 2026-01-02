import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 120_000, // 2 minutes for full game flow
  expect: { timeout: 10000 }, // Increased for WebSocket operations
  fullyParallel: false, // Run tests serially to avoid conflicts
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Run one test at a time
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report' }]
  ],
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
  ],
  // Ensure servers are running before tests
  webServer: [
    {
      command: 'cd ../../server && npm start',
      port: 3001,
      timeout: 60_000,
      reuseExistingServer: true,
    },
    {
      command: 'cd .. && npm start',
      port: 3000,
      timeout: 120_000,
      reuseExistingServer: true,
    },
  ],
});