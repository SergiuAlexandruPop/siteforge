import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import type { BlogMeta, BlogPost } from '@/types/blog'
import type { Language } from '@/types/config'
import { contentFolderSuffix, getDefaultLanguage } from './i18n'

// ---------------------------------------------------------------------------
// Content Library
// ---------------------------------------------------------------------------
// Reads markdown files from the active client's content/ folder.
// Used at build time for static generation — no runtime filesystem access.
// ---------------------------------------------------------------------------

interface PageFrontmatter {
  title: string
  description: string
}

export interface PageContent {
  frontmatter: PageFrontmatter
  slug: string
  contentHtml: string
}

/**
 * Returns the absolute path to the active client's content directory.
 * Example: /path/to/siteforge/clients/portfolio/content
 */
function getContentDir(): string {
  const activeClient = process.env.ACTIVE_CLIENT
  if (!activeClient) {
    throw new Error('ACTIVE_CLIENT environment variable is not set.')
  }

  // process.cwd() is the project root in Next.js builds
  return path.join(process.cwd(), 'clients', activeClient, 'content')
}

/**
 * Converts a markdown string to HTML.
 */
async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(html, { allowDangerousHtml: true })
    .process(markdown)
  return result.toString()
}

/**
 * Get all page slugs from the pages/ directory (for generateStaticParams).
 * Excludes index.md — that's the homepage, handled by app/page.tsx.
 */
function pagesFolder(language: Language): string {
  return `pages${contentFolderSuffix(language)}`
}

function blogFolder(language: Language): string {
  return `blog${contentFolderSuffix(language)}`
}

export function getPageSlugs(language: Language = getDefaultLanguage()): string[] {
  const pagesDir = path.join(getContentDir(), pagesFolder(language))

  if (!fs.existsSync(pagesDir)) return []

  return fs
    .readdirSync(pagesDir)
    .filter((file) => file.endsWith('.md') && file !== 'index.md')
    .map((file) => file.replace(/\.md$/, ''))
}

/**
 * Get a single page by slug. Returns null if file doesn't exist.
 */
export async function getPageBySlug(
  slug: string,
  language: Language = getDefaultLanguage()
): Promise<PageContent | null> {
  const filePath = path.join(getContentDir(), pagesFolder(language), `${slug}.md`)

  if (!fs.existsSync(filePath)) return null

  const fileContents = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(fileContents)
  const contentHtml = await markdownToHtml(content)

  return {
    frontmatter: {
      title: data.title ?? slug,
      description: data.description ?? '',
    },
    slug,
    contentHtml,
  }
}

// ---------------------------------------------------------------------------
// Blog Content
// ---------------------------------------------------------------------------

/**
 * Get all published blog posts, sorted by date descending.
 */
export async function getAllBlogPosts(
  language: Language = getDefaultLanguage()
): Promise<BlogPost[]> {
  const blogDir = path.join(getContentDir(), blogFolder(language))

  if (!fs.existsSync(blogDir)) return []

  const files = fs
    .readdirSync(blogDir)
    .filter((file) => file.endsWith('.md'))

  const posts: BlogPost[] = []

  for (const file of files) {
    const filePath = path.join(blogDir, file)
    const fileContents = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(fileContents)

    const meta = parseBlogMeta(data, file)
    if (!meta.published) continue

    const contentHtml = await markdownToHtml(content)
    posts.push({ meta, contentHtml })
  }

  // Sort by date descending (newest first)
  posts.sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime())

  return posts
}

/**
 * Get a single blog post by slug. Returns null if not found or not published.
 */
export async function getBlogBySlug(
  slug: string,
  language: Language = getDefaultLanguage()
): Promise<BlogPost | null> {
  const blogDir = path.join(getContentDir(), blogFolder(language))

  if (!fs.existsSync(blogDir)) return null

  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.md'))

  for (const file of files) {
    const filePath = path.join(blogDir, file)
    const fileContents = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(fileContents)

    const meta = parseBlogMeta(data, file)
    if (meta.slug !== slug) continue
    if (!meta.published) return null

    const contentHtml = await markdownToHtml(content)
    return { meta, contentHtml }
  }

  return null
}

/**
 * Get all published blog post slugs (for generateStaticParams).
 */
export function getBlogSlugs(language: Language = getDefaultLanguage()): string[] {
  const blogDir = path.join(getContentDir(), blogFolder(language))

  if (!fs.existsSync(blogDir)) return []

  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.md'))
  const slugs: string[] = []

  for (const file of files) {
    const filePath = path.join(blogDir, file)
    const fileContents = fs.readFileSync(filePath, 'utf-8')
    const { data } = matter(fileContents)

    if (data.published === false) continue
    slugs.push(data.slug ?? file.replace(/\.md$/, ''))
  }

  return slugs
}

/**
 * Parse frontmatter data into a typed BlogMeta with safe defaults.
 */
function parseBlogMeta(data: Record<string, unknown>, filename: string): BlogMeta {
  return {
    title: (data.title as string) ?? 'Untitled',
    slug: (data.slug as string) ?? filename.replace(/\.md$/, ''),
    date: (data.date as string) ?? new Date().toISOString().slice(0, 10),
    author: (data.author as string) ?? 'Unknown',
    excerpt: (data.excerpt as string) ?? '',
    featuredImage: (data.featuredImage as string) ?? '',
    published: data.published !== false,
    readingTime: (data.readingTime as number) ?? 3,
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    pinned: data.pinned === true,
  }
}

// ---------------------------------------------------------------------------
// Page Content
// ---------------------------------------------------------------------------

/**
 * Get the homepage content (index.md).
 */
export async function getHomePage(
  language: Language = getDefaultLanguage()
): Promise<PageContent | null> {
  const filePath = path.join(getContentDir(), pagesFolder(language), 'index.md')

  if (!fs.existsSync(filePath)) return null

  const fileContents = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(fileContents)
  const contentHtml = await markdownToHtml(content)

  return {
    frontmatter: {
      title: data.title ?? 'Home',
      description: data.description ?? '',
    },
    slug: '',
    contentHtml,
  }
}
