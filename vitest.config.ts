import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'

// ---------------------------------------------------------------------------
// Vitest configuration
// ---------------------------------------------------------------------------
// Pure-logic unit + contract tests. Node environment (no DOM needed yet).
// `@/*` alias mirrors tsconfig so tests import shared code the same way the
// app does. No globals — every test imports { describe, it, expect } explicitly.
// ---------------------------------------------------------------------------

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'node',
    globals: false,
    include: ['tests/**/*.test.ts'],
  },
})
