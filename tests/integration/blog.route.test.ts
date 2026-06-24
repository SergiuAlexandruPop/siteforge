import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest'

// ---------------------------------------------------------------------------
// /api/blog — GET (list) / POST (create|update) / DELETE
// ---------------------------------------------------------------------------
// Mocks @/lib/auth (gating) and @/lib/github (no network) and next/server.
// The route captures ACTIVE_CLIENT in a module-load const, so we pin the env
// and dynamic-import the handlers afterwards.
// ---------------------------------------------------------------------------

vi.mock('next/server', () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) =>
      new Response(JSON.stringify(body), {
        status: init?.status ?? 200,
        headers: { 'content-type': 'application/json' },
      }),
  },
}))

vi.mock('@/lib/auth', () => ({
  isAuthenticated: vi.fn(),
}))

vi.mock('@/lib/github', () => ({
  listFiles: vi.fn(),
  readFile: vi.fn(),
  createFile: vi.fn(),
  updateFile: vi.fn(),
  deleteFile: vi.fn(),
}))

import { isAuthenticated } from '@/lib/auth'
import {
  listFiles,
  readFile,
  createFile,
  updateFile,
  deleteFile,
} from '@/lib/github'

const mockAuthed = vi.mocked(isAuthenticated)
const mockList = vi.mocked(listFiles)
const mockRead = vi.mocked(readFile)
const mockCreate = vi.mocked(createFile)
const mockUpdate = vi.mocked(updateFile)
const mockDelete = vi.mocked(deleteFile)

// Handlers are dynamically imported after ACTIVE_CLIENT is pinned.
let GET: (req: Request) => Promise<Response>
let POST: (req: Request) => Promise<Response>
let DELETE: (req: Request) => Promise<Response>

beforeAll(async () => {
  process.env.ACTIVE_CLIENT = 'portfolio'
  const mod = (await import('@/app/api/blog/route')) as unknown as {
    GET: typeof GET
    POST: typeof POST
    DELETE: typeof DELETE
  }
  GET = mod.GET
  POST = mod.POST
  DELETE = mod.DELETE
})

beforeEach(() => {
  vi.clearAllMocks()
})

function req(url: string, body?: unknown): Request {
  return new Request(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
}

// ---------------------------------------------------------------------------
// Auth gating — the headline guarantee
// ---------------------------------------------------------------------------

describe('/api/blog — auth gating', () => {
  beforeEach(() => mockAuthed.mockResolvedValue(false))

  it('GET returns 401 and never touches GitHub', async () => {
    const res = await GET(new Request('http://localhost/api/blog'))
    expect(res.status).toBe(401)
    expect(mockList).not.toHaveBeenCalled()
  })

  it('POST returns 401 and writes nothing', async () => {
    const res = await POST(
      req('http://localhost/api/blog', { filename: 'x.md', content: 'y' }),
    )
    expect(res.status).toBe(401)
    expect(mockCreate).not.toHaveBeenCalled()
    expect(mockUpdate).not.toHaveBeenCalled()
  })

  it('DELETE returns 401 and deletes nothing', async () => {
    const res = await DELETE(
      req('http://localhost/api/blog', { filePath: 'p', sha: 's' }),
    )
    expect(res.status).toBe(401)
    expect(mockDelete).not.toHaveBeenCalled()
  })
})

// ---------------------------------------------------------------------------
// GET — list + parse + sort
// ---------------------------------------------------------------------------

describe('GET /api/blog — authed listing', () => {
  beforeEach(() => mockAuthed.mockResolvedValue(true))

  it('parses frontmatter and sorts newest-first', async () => {
    mockList.mockResolvedValue(['first.md', 'second.md'])
    mockRead.mockImplementation(async (path: string) => {
      if (path.endsWith('first.md')) {
        return {
          sha: 'sha-first',
          content:
            '---\ntitle: First Post\nslug: first-post\ndate: 2025-06-01\npublished: true\n---\nbody',
        }
      }
      return {
        sha: 'sha-second',
        content:
          '---\ntitle: Second Post\nslug: second-post\ndate: 2024-01-01\npublished: false\n---\nbody',
      }
    })

    const res = await GET(new Request('http://localhost/api/blog'))
    expect(res.status).toBe(200)
    const { posts } = await res.json()

    expect(posts).toHaveLength(2)
    expect(posts[0].slug).toBe('first-post') // 2025 before 2024
    expect(posts[0].published).toBe(true)
    expect(posts[0].sha).toBe('sha-first')
    expect(posts[1].slug).toBe('second-post')
    expect(posts[1].published).toBe(false)
  })

  it('reads from the blog-en folder when language=en', async () => {
    mockList.mockResolvedValue([])
    await GET(new Request('http://localhost/api/blog?language=en'))
    expect(mockList).toHaveBeenCalledWith('clients/portfolio/content/blog-en')
  })
})

// ---------------------------------------------------------------------------
// POST — create vs update + validation
// ---------------------------------------------------------------------------

describe('POST /api/blog — create / update', () => {
  beforeEach(() => mockAuthed.mockResolvedValue(true))

  it('creates a new file when no sha is provided', async () => {
    const res = await POST(
      req('http://localhost/api/blog', {
        filename: 'new-post.md',
        content: '---\ntitle: New\n---\nbody',
        title: 'New',
      }),
    )
    expect(res.status).toBe(200)
    expect(mockUpdate).not.toHaveBeenCalled()
    expect(mockCreate).toHaveBeenCalledOnce()
    const [path, content, message] = mockCreate.mock.calls[0]
    expect(path).toBe('clients/portfolio/content/blog/new-post.md')
    expect(content).toContain('title: New')
    expect(message).toContain('Created: New')
  })

  it('updates an existing file when a sha is provided', async () => {
    const res = await POST(
      req('http://localhost/api/blog', {
        filename: 'edit.md',
        content: 'updated',
        sha: 'existing-sha',
        title: 'Edit',
      }),
    )
    expect(res.status).toBe(200)
    expect(mockCreate).not.toHaveBeenCalled()
    expect(mockUpdate).toHaveBeenCalledOnce()
    const [path, , sha, message] = mockUpdate.mock.calls[0]
    expect(path).toBe('clients/portfolio/content/blog/edit.md')
    expect(sha).toBe('existing-sha')
    expect(message).toContain('Updated: Edit')
  })

  it('writes to blog-en when language=en', async () => {
    await POST(
      req('http://localhost/api/blog', {
        filename: 'post.md',
        content: 'x',
        language: 'en',
        title: 'EN',
      }),
    )
    const [path] = mockCreate.mock.calls[0]
    expect(path).toBe('clients/portfolio/content/blog-en/post.md')
  })

  it('returns 400 and writes nothing when content is missing', async () => {
    const res = await POST(
      req('http://localhost/api/blog', { filename: 'x.md' }),
    )
    expect(res.status).toBe(400)
    expect(mockCreate).not.toHaveBeenCalled()
    expect(mockUpdate).not.toHaveBeenCalled()
  })
})

// ---------------------------------------------------------------------------
// DELETE
// ---------------------------------------------------------------------------

describe('DELETE /api/blog', () => {
  beforeEach(() => mockAuthed.mockResolvedValue(true))

  it('deletes a file given path + sha', async () => {
    const res = await DELETE(
      req('http://localhost/api/blog', {
        filePath: 'clients/portfolio/content/blog/old.md',
        sha: 'old-sha',
        title: 'Old',
      }),
    )
    expect(res.status).toBe(200)
    expect(mockDelete).toHaveBeenCalledOnce()
    const [path, sha, message] = mockDelete.mock.calls[0]
    expect(path).toBe('clients/portfolio/content/blog/old.md')
    expect(sha).toBe('old-sha')
    expect(message).toContain('Deleted: Old')
  })

  it('returns 400 and deletes nothing when sha is missing', async () => {
    const res = await DELETE(
      req('http://localhost/api/blog', { filePath: 'some/path.md' }),
    )
    expect(res.status).toBe(400)
    expect(mockDelete).not.toHaveBeenCalled()
  })
})
