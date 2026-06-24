/// <reference types="vite/client" />
import { describe, it, expect } from 'vitest'
import type { ClientConfig, ClientManifest, ClientTheme } from '@/types/config'

// ---------------------------------------------------------------------------
// Client MANIFEST CONTRACT TEST  (review §8 — single-entry / no-leak guardrail)
// ---------------------------------------------------------------------------
// The P0 code-split replaced four parallel registries with ONE entry per client:
// clients/<name>/index.ts exporting a ClientManifest. The build resolves
// ACTIVE_CLIENT → that single manifest via scripts/gen-active-client.ts, so only
// the active client's code is ever bundled.
//
// This test asserts the invariant that makes that safe:
//   - every client folder has exactly one index.ts exporting a manifest
//   - the manifest's config/theme are the same objects as the folder's
//     config.ts / theme.ts (no divergence)
//   - optional layout/homepage/pages, when present, are the right types
//
// New clients are picked up automatically — no edits to this file needed.
// ---------------------------------------------------------------------------

function folderName(globPath: string): string {
  const match = globPath.match(/clients\/([^/]+)\//)
  if (!match) throw new Error(`Could not parse client name from: ${globPath}`)
  return match[1]
}

const manifestModules = import.meta.glob('../../clients/*/index.ts', {
  eager: true,
  import: 'manifest',
}) as Record<string, ClientManifest>

const configModules = import.meta.glob('../../clients/*/config.ts', {
  eager: true,
  import: 'default',
}) as Record<string, ClientConfig>

const themeModules = import.meta.glob('../../clients/*/theme.ts', {
  eager: true,
  import: 'default',
}) as Record<string, ClientTheme>

const clients = Object.entries(manifestModules).map(([path, manifest]) => {
  const name = folderName(path)
  const config = Object.entries(configModules).find(
    ([p]) => folderName(p) === name,
  )?.[1]
  const theme = Object.entries(themeModules).find(
    ([p]) => folderName(p) === name,
  )?.[1]
  return { name, manifest, config, theme }
})

describe('client manifest discovery', () => {
  it('every client folder exports a manifest from index.ts', () => {
    // If a client has config.ts but no index.ts, the build can never select it.
    const manifestNames = new Set(clients.map((c) => c.name))
    for (const configPath of Object.keys(configModules)) {
      const name = folderName(configPath)
      expect(
        manifestNames.has(name),
        `clients/${name} has config.ts but no index.ts manifest`,
      ).toBe(true)
    }
  })

  it('finds at least one client manifest', () => {
    expect(clients.length).toBeGreaterThan(0)
  })
})

describe.each(clients)('manifest contract: $name', ({ name, manifest, config, theme }) => {
  it('exports a manifest object', () => {
    expect(manifest, `${name}/index.ts must export { manifest }`).toBeDefined()
  })

  it('manifest.config is the same object as the folder config.ts', () => {
    expect(manifest.config).toBe(config)
  })

  it('manifest.theme is the same object as the folder theme.ts', () => {
    expect(manifest.theme).toBe(theme)
  })

  it('optional layout/homepage are functions when present', () => {
    if (manifest.layout !== undefined) expect(typeof manifest.layout).toBe('function')
    if (manifest.homepage !== undefined) expect(typeof manifest.homepage).toBe('function')
  })

  it('optional pages map holds only component functions', () => {
    if (manifest.pages === undefined) return
    for (const [slug, Comp] of Object.entries(manifest.pages)) {
      expect(typeof Comp, `pages["${slug}"]`).toBe('function')
    }
  })

  // The shared /projects/[slug] routes delegate entirely to this capability
  // (Decision #77). If its shape drifts, the dynamic route breaks for that
  // client only — assert the contract so it fails fast and names the client.
  describe('projectDetail capability', () => {
    it('is well-formed when present (skipped when omitted)', () => {
      const pd = manifest.projectDetail
      if (pd === undefined) return

      expect(Array.isArray(pd.slugs), 'slugs must be an array').toBe(true)
      for (const slug of pd.slugs) {
        expect(typeof slug, 'each slug is a string').toBe('string')
      }
      expect(typeof pd.getMetadata, 'getMetadata is a function').toBe('function')
      expect(typeof pd.Component, 'Component is a function').toBe('function')
    })

    it('getMetadata returns metadata for a known slug and null for an unknown one', () => {
      const pd = manifest.projectDetail
      if (pd === undefined || pd.slugs.length === 0) return

      const known = pd.getMetadata(pd.slugs[0], 'ro')
      expect(known, `getMetadata("${pd.slugs[0]}", "ro")`).not.toBeNull()
      expect(typeof known?.title).toBe('string')
      expect(typeof known?.description).toBe('string')

      expect(pd.getMetadata('__nonexistent_slug__', 'ro')).toBeNull()
    })
  })
})
