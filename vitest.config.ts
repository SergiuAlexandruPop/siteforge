import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'

// ---------------------------------------------------------------------------
// Vitest configuration
// ---------------------------------------------------------------------------
// Pure-logic unit + contract + route-integration tests. Node environment (no
// DOM needed yet). `@/*` alias mirrors tsconfig so tests import shared code the
// same way the app does. No globals — every test imports { describe, it, expect }
// explicitly.
//
// `esbuild.jsx: 'automatic'` matches the app's JSX runtime (tsconfig uses
// "preserve" → Next's automatic runtime). Without it, esbuild falls back to the
// classic transform and any test that imports a component fails with
// "React is not defined" (e.g. the manifest contract test, which imports each
// client's full manifest — components included — to assert its shape).
//
// E2E specs live in `e2e/` and run under Playwright, not Vitest — `include`
// scopes Vitest to `tests/` so the two runners never pick up each other's files.
// ---------------------------------------------------------------------------

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  esbuild: {
    jsx: 'automatic',
  },
  test: {
    environment: 'node',
    globals: false,
    include: ['tests/**/*.test.ts'],
  },
})
