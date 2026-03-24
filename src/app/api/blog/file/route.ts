import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { readFile } from '@/lib/github'

/**
 * GET /api/blog/file?path=clients/portfolio/content/blog/my-post.md
 * Returns the raw file content and SHA for editing.
 */
export async function GET(request: Request) {
  const authed = await isAuthenticated()
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const filePath = searchParams.get('path')

    if (!filePath) {
      return NextResponse.json({ error: 'path is required.' }, { status: 400 })
    }

    const file = await readFile(filePath)

    if (!file) {
      return NextResponse.json({ error: 'File not found.' }, { status: 404 })
    }

    return NextResponse.json({ content: file.content, sha: file.sha })
  } catch (error) {
    console.error('Blog file API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to read file.' },
      { status: 500 }
    )
  }
}
