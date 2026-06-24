import { defineConfig, devices } from '@playwright/test'

// ---------------------------------------------------------------------------
// Playwright E2E configuration
// ---------------------------------------------------------------------------
// Smoke-tests a REAL production build of one client (portfolio) — the same
// `next build` + `next start` path Vercel runs — so the test exercises the
// app as users actually get it, not the dev server.
//
// Scope (Decision: portfolio-only, chromium-only — see CONTEXT.md):
//   - One client keeps CI minutes low; the multi-client guardrail is already
//     covered by the Vitest config/manifest contract tests.
//   - One browser engine (chromium) is enough for a smoke check; add firefox/
//     webkit projects here later if cross-engine coverage is needed.
//
// `webServer` builds + starts portfolio on :3100 and waits for it before the
// specs run. Locally an already-running server is reused; in CI a fresh one is
// always started (reuseExistingServer: false when process.env.CI is set).
// ---------------------------------------------------------------------------

const PORT = 3100
const BASE_URL = `http://localhost:${PORT}`

export default defineConfig({
  testDir: './e2e',
  // Fail the CI build if a `test.only` is left in the source.
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `yarn build:portfolio && cross-env ACTIVE_CLIENT=portfolio yarn start --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    // A cold production build can take a while on CI runners.
    timeout: 180_000,
  },
})
