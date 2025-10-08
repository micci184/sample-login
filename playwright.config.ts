import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright 設定ファイル
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  /* テストを並列実行 */
  fullyParallel: true,
  /* CI で失敗したテストのみ再実行しない */
  forbidOnly: !!process.env.CI,
  /* CI でのリトライ回数 */
  retries: process.env.CI ? 2 : 0,
  /* 並列実行するワーカー数 */
  workers: process.env.CI ? 1 : undefined,
  /* レポート形式 */
  reporter: 'html',
  /* 共通設定 */
  use: {
    /* ベース URL */
    baseURL: 'http://localhost:3000',
    /* スクリーンショットを失敗時のみ取得 */
    screenshot: 'only-on-failure',
    /* ビデオを失敗時のみ記録 */
    video: 'retain-on-failure',
    /* トレースを失敗時のみ記録 */
    trace: 'on-first-retry',
  },

  /* プロジェクト設定（複数ブラウザ対応） */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // Firefox と WebKit は必要に応じてコメント解除
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    //
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* モバイルブラウザテスト */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  /* 開発サーバー設定 */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
