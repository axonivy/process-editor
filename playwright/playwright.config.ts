import { defineConfig, devices } from '@playwright/test';

const STANDALONE_URL = process.env.CI ? 'http://localhost:4000' : 'http://localhost:3000';
const VIEWER_URL = process.env.CI ? 'http://localhost:4001' : 'http://localhost:3001';
const INSCRIPTION_URL = process.env.CI ? 'http://localhost:4003' : 'http://localhost:3003';
const REPORT_DIR = process.env.REPORT_DIR ? `${process.env.REPORT_DIR}/` : '';

export default defineConfig({
  timeout: 1000 * (process.env.CI ? 90 : 30),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 3 : 0,
  reporter: process.env.CI ? [['./tests/custom-reporter.ts'], ['junit', { outputFile: `${REPORT_DIR}report.xml` }], ['list']] : 'html',
  use: {
    actionTimeout: 0,
    trace: 'retain-on-failure',
    headless: true
  },
  webServer: [
    {
      command: `pnpm run --filter @axonivy/process-editor-standalone ${process.env.CI ? 'serve' : 'dev'}`,
      url: STANDALONE_URL,
      reuseExistingServer: !process.env.CI
    },
    {
      command: `pnpm run --filter @axonivy/process-editor-viewer ${process.env.CI ? 'serve' : 'dev'}`,
      url: VIEWER_URL,
      reuseExistingServer: !process.env.CI
    },
    {
      command: `pnpm run --filter @axonivy/process-editor-inscription-standalone ${process.env.CI ? 'serve' : 'dev'}`,
      url: INSCRIPTION_URL,
      reuseExistingServer: !process.env.CI
    }
  ],
  globalSetup: './tests/global.setup',
  projects: [
    { name: 'standalone-chrome', use: { ...devices['Desktop Chrome'], baseURL: STANDALONE_URL }, testDir: './tests/standalone' },
    { name: 'standalone-firefox', use: { ...devices['Desktop Firefox'], baseURL: STANDALONE_URL }, testDir: './tests/standalone' },
    { name: 'standalone-webkit', use: { ...devices['Desktop Safari'], baseURL: STANDALONE_URL }, testDir: './tests/standalone' },
    { name: 'viewer-chrome', use: { ...devices['Desktop Chrome'], baseURL: VIEWER_URL }, testDir: './tests/viewer' },
    { name: 'viewer-firefox', use: { ...devices['Desktop Firefox'], baseURL: VIEWER_URL }, testDir: './tests/viewer' },
    { name: 'viewer-webkit', use: { ...devices['Desktop Safari'], baseURL: VIEWER_URL }, testDir: './tests/viewer' },
    { name: 'inscription-chrome', use: { ...devices['Desktop Chrome'], baseURL: INSCRIPTION_URL }, testDir: './tests/inscription' },
    { name: 'inscription-firefox', use: { ...devices['Desktop Firefox'], baseURL: INSCRIPTION_URL }, testDir: './tests/inscription' },
    { name: 'inscription-webkit', use: { ...devices['Desktop Safari'], baseURL: INSCRIPTION_URL }, testDir: './tests/inscription' },
    {
      name: 'screenshots-process',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1000, height: 500 }, colorScheme: 'light', baseURL: STANDALONE_URL },
      testDir: './tests/screenshots/editor'
    },
    {
      name: 'screenshots-inscription',
      use: { ...devices['Desktop Chrome'], viewport: { width: 500, height: 1000 }, colorScheme: 'light', baseURL: INSCRIPTION_URL },
      testDir: './tests/screenshots/inscription'
    }
  ]
});
