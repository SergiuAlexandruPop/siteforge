import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

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
  const result = await remark().use(html).process(markdown)
  return result.toString()
}

/**
 * Get all page slugs from the pages/ directory (for generateStaticParams).
 * Excludes index.md — that's the homepage, handled by app/page.tsx.
 */
export function getPageSlugs(language: 'ro' | 'en' = 'ro'): string[] {
  const folder = language === 'en' ? 'pages-en' : 'pages'
  const pagesDir = path.join(getContentDir(), folder)

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
  language: 'ro' | 'en' = 'ro'
): Promise<PageContent | null> {
  const folder = language === 'en' ? 'pages-en' : 'pages'
  const filePath = path.join(getContentDir(), folder, `${slug}.md`)

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

/**
 * Get the homepage content (index.md).
 */
export async function getHomePage(
  language: 'ro' | 'en' = 'ro'
): Promise<PageContent | null> {
  const folder = language === 'en' ? 'pages-en' : 'pages'
  const filePath = path.join(getContentDir(), folder, 'index.md')

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
