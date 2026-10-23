import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env.E2E_PORT || 4173);
const BASE_URL = `http://127.0.0.1:${PORT}`;
const DESKTOP_VIEWPORT = { width: 1280, height: 800 };

/**
 * Configuración de pruebas E2E, visuales y de accesibilidad cross-browser de Materix UI.
 * Sirve la raíz del repo (los ejemplos y plantillas cargan ../../dist), así que requiere `npm run build` previo.
 */
export default defineConfig({
  testDir: 'tests/e2e',
  outputDir: 'test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 45_000,
  expect: {
    timeout: 7_000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
      animations: 'disabled',
      caret: 'hide',
      scale: 'css',
    },
  },
  // Capturas base versionadas por proyecto; E2E_SNAPSHOT_DIR permite validar en una carpeta temporal.
  snapshotPathTemplate: process.env.E2E_SNAPSHOT_DIR
    ? `${process.env.E2E_SNAPSHOT_DIR}/{projectName}/{arg}{ext}`
    : 'tests/e2e/__screenshots__/{projectName}/{arg}{ext}',
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: `node tests/e2e/server.mjs ${PORT}`,
    url: `${BASE_URL}/package.json`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: DESKTOP_VIEWPORT } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'], viewport: DESKTOP_VIEWPORT } },
    { name: 'webkit', use: { ...devices['Desktop Safari'], viewport: DESKTOP_VIEWPORT } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 5'] } },
    { name: 'mobile-webkit', use: { ...devices['iPhone 13'] } },
  ],
});
