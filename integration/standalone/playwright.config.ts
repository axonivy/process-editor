import { devices, defineConfig } from '@playwright/test';

const STANDALONE_URL = process.env.CI ? 'http://localhost:4000' : 'http://localhost:3000';

export default defineConfig({
  timeout: 1000 * (process.env.CI ? 120 : 30),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['./webtests/custom-reporter.ts'], ['junit', { outputFile: 'report.xml' }], ['list']] : 'html',
  use: {
    actionTimeout: 0,
    trace: 'retain-on-failure',
    headless: process.env.CI ? true : false
  },
  webServer: [
    {
      command: `npm run ${process.env.CI ? 'serve' : 'dev'} -w @axonivy/process-editor-standalone`,
      url: STANDALONE_URL,
      reuseExistingServer: !process.env.CI
    }
  ],
  projects: [
    { name: 'standalone-chrome', use: { ...devices['Desktop Chrome'], baseURL: STANDALONE_URL } },
    { name: 'standalone-firefox', use: { ...devices['Desktop Firefox'], baseURL: STANDALONE_URL } },
    { name: 'standalone-webkit', use: { ...devices['Desktop Safari'], baseURL: STANDALONE_URL } }
  ]
});
