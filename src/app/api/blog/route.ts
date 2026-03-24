import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { readFile, createFile, updateFile, deleteFile, listFiles } from '@/lib/github'

// ---------------------------------------------------------------------------
// Blog API — CRUD for markdown blog posts via GitHub API
// ---------------------------------------------------------------------------

const ACTIVE_CLIENT = process.env.ACTIVE_CLIENT ?? 'portfolio'

function getBlogDir(language: string = 'ro'): string {
  const folder = language === 'en' ? 'blog-en' : 'blog'
  return `clients/${ACTIVE_CLIENT}/content/${folder}`
}

/**
 * GET /api/blog — List all blog posts (reads from GitHub)
 * Query params: ?language=ro (default) or ?language=en
 */
export async function GET(request: Request) {
  const authed = await isAuthenticated()
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const language = searchParams.get('language') ?? 'ro'
    const blogDir = getBlogDir(language)
    const files = await listFiles(blogDir)

    const posts = []
    for (const filename of files) {
      const filePath = `${blogDir}/${filename}`
      const file = await readFile(filePath)
      if (!file) continue

      // Parse frontmatter manually (just need metadata, not full rendering)
      const frontmatterMatch = file.content.match(/^---\n([\s\S]*?)\n---/)
      if (!frontmatterMatch) continue

      const frontmatter: Record<string, string> = {}
      for (const line of frontmatterMatch[1].split('\n')) {
        const colonIndex = line.indexOf(':')
        if (colonIndex === -1) continue
        const key = line.slice(0, colonIndex).trim()
        let value = line.slice(colonIndex + 1).trim()
        // Remove surrounding quotes
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1)
        }
        frontmatter[key] = value
      }

      posts.push({
        filename,
        filePath,
        sha: file.sha,
        title: frontmatter.title ?? filename,
        slug: frontmatter.slug ?? filename.replace(/\.md$/, ''),
        date: frontmatter.date ?? '',
        published: frontmatter.published !== 'false',
      })
    }

    // Sort by date descending
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Blog API GET error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch posts.' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/blog — Create or update a blog post
 * Body: { filename, content, sha? (required for update), language? }
 */
export async function POST(request: Request) {
  const authed = await isAuthenticated()
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { filename, content, sha, language = 'ro', title = 'Untitled' } = body

    if (!filename || !content) {
      return NextResponse.json(
        { error: 'filename and content are required.' },
        { status: 400 }
      )
    }

    const blogDir = getBlogDir(language)
    const filePath = `${blogDir}/${filename}`

    if (sha) {
      // Update existing
      const commitMsg = `[content][${ACTIVE_CLIENT}] Updated: ${title}`
      await updateFile(filePath, content, sha, commitMsg)
    } else {
      // Create new
      const commitMsg = `[content][${ACTIVE_CLIENT}] Created: ${title}`
      await createFile(filePath, content, commitMsg)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Blog API POST error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save post.' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/blog — Delete a blog post
 * Body: { filePath, sha, title? }
 */
export async function DELETE(request: Request) {
  const authed = await isAuthenticated()
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { filePath, sha, title = 'Unknown' } = body

    if (!filePath || !sha) {
      return NextResponse.json(
        { error: 'filePath and sha are required.' },
        { status: 400 }
      )
    }

    const commitMsg = `[content][${ACTIVE_CLIENT}] Deleted: ${title}`
    await deleteFile(filePath, sha, commitMsg)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Blog API DELETE error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete post.' },
      { status: 500 }
    )
  }
}
