import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import { resolve } from 'node:path'

// ---------------------------------------------------------------------------
// content.ts — markdown reading, frontmatter parsing, filtering & sorting
// ---------------------------------------------------------------------------
// content.ts reads from `${process.cwd()}/clients/${ACTIVE_CLIENT}/content`.
// We point cwd at tests/fixtures and use a fake client folder ("fixture") so
// the tests run against committed markdown fixtures, not real client content.
//
// content.ts also imports `./i18n` (which would pull in client-config and read
// ACTIVE_CLIENT). We mock it to keep these tests focused on file/markdown logic.
// ---------------------------------------------------------------------------

vi.mock('@/lib/i18n', () => ({
  getDefaultLanguage: () => 'ro',
  contentFolderSuffix: (lang: string) => (lang === 'ro' ? '' : `-${lang}`),
}))

import {
  getPageSlugs,
  getPageBySlug,
  getHomePage,
  getAllBlogPosts,
  getBlogBySlug,
  getBlogSlugs,
} from '@/lib/content'

const FIXTURES_ROOT = resolve(__dirname, '../fixtures')
const PREV_ACTIVE_CLIENT = process.env.ACTIVE_CLIENT
let cwdSpy: ReturnType<typeof vi.spyOn>

beforeAll(() => {
  // getContentDir() -> `${cwd}/clients/fixture/content`
  cwdSpy = vi.spyOn(process, 'cwd').mockReturnValue(FIXTURES_ROOT)
  process.env.ACTIVE_CLIENT = 'fixture'
})

afterAll(() => {
  cwdSpy.mockRestore()
  process.env.ACTIVE_CLIENT = PREV_ACTIVE_CLIENT
})

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------

describe('getPageSlugs', () => {
  it('returns page slugs and excludes index.md', () => {
    const slugs = getPageSlugs('ro')
    expect(slugs).toContain('about')
    expect(slugs).not.toContain('index')
  })

  it('returns [] for a language whose folder does not exist', () => {
    expect(getPageSlugs('de')).toEqual([])
  })
})

describe('getPageBySlug', () => {
  it('reads frontmatter and renders markdown to HTML', async () => {
    const page = await getPageBySlug('about', 'ro')
    expect(page).not.toBeNull()
    expect(page!.frontmatter.title).toBe('About')
    expect(page!.frontmatter.description).toBe('About description')
    expect(page!.contentHtml).toContain('<h2')
    expect(page!.contentHtml).toContain('<strong>bold</strong>')
  })

  it('returns null for a missing page', async () => {
    expect(await getPageBySlug('does-not-exist', 'ro')).toBeNull()
  })

  it('returns null when the language folder does not exist', async () => {
    expect(await getPageBySlug('about', 'de')).toBeNull()
  })
})

describe('getHomePage', () => {
  it('reads index.md as the homepage', async () => {
    const home = await getHomePage('ro')
    expect(home).not.toBeNull()
    expect(home!.frontmatter.title).toBe('Home')
    expect(home!.contentHtml).toContain('<h1')
  })
})

// ---------------------------------------------------------------------------
// Blog — filtering & sorting
// ---------------------------------------------------------------------------

describe('getAllBlogPosts', () => {
  it('returns only published posts, newest first', async () => {
    const posts = await getAllBlogPosts('ro')
    const slugs = posts.map((p) => p.meta.slug)
    // charlie-draft (published: false) must be excluded.
    expect(slugs).toEqual(['alpha-new', 'bravo-old', 'delta-minimal'])
  })

  it('excludes drafts', async () => {
    const posts = await getAllBlogPosts('ro')
    expect(posts.some((p) => p.meta.slug === 'charlie-draft')).toBe(false)
  })

  it('renders post body to HTML', async () => {
    const posts = await getAllBlogPosts('ro')
    const alpha = posts.find((p) => p.meta.slug === 'alpha-new')!
    expect(alpha.contentHtml).toContain('<h1')
  })

  it('returns [] when the blog folder does not exist', async () => {
    expect(await getAllBlogPosts('de')).toEqual([])
  })
})

describe('getBlogSlugs', () => {
  it('returns published slugs and excludes drafts', () => {
    const slugs = getBlogSlugs('ro')
    expect(slugs.sort()).toEqual(['alpha-new', 'bravo-old', 'delta-minimal'])
    expect(slugs).not.toContain('charlie-draft')
  })
})

// ---------------------------------------------------------------------------
// Blog — single post + frontmatter parsing
// ---------------------------------------------------------------------------

describe('getBlogBySlug', () => {
  it('returns a published post and preserves a colon in the title', async () => {
    // gray-matter handles the quoted "Alpha: A New Post" correctly — unlike the
    // hand-rolled parser in the blog API (review §4 P1).
    const post = await getBlogBySlug('alpha-new', 'ro')
    expect(post).not.toBeNull()
    expect(post!.meta.title).toBe('Alpha: A New Post')
    expect(post!.meta.tags).toEqual(['tech', 'ai'])
    expect(post!.meta.pinned).toBe(true)
    expect(post!.meta.readingTime).toBe(5)
  })

  it('returns null for an unpublished draft', async () => {
    expect(await getBlogBySlug('charlie-draft', 'ro')).toBeNull()
  })

  it('returns null for a missing slug', async () => {
    expect(await getBlogBySlug('nope', 'ro')).toBeNull()
  })

  it('applies safe defaults for minimal frontmatter (parseBlogMeta)', async () => {
    const post = await getBlogBySlug('delta-minimal', 'ro')
    expect(post).not.toBeNull()
    const m = post!.meta
    expect(m.author).toBe('Unknown')
    expect(m.excerpt).toBe('')
    expect(m.featuredImage).toBe('')
    expect(m.readingTime).toBe(3)
    expect(m.tags).toEqual([])
    expect(m.pinned).toBe(false)
    expect(m.published).toBe(true) // absent `published` defaults to published
  })
})
