'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface PostEntry {
  filename: string
  filePath: string
  sha: string
  title: string
  slug: string
  date: string
  published: boolean
}

export default function AdminDashboard() {
  const router = useRouter()
  const [posts, setPosts] = useState<PostEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [language, setLanguage] = useState<'ro' | 'en'>('ro')
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/blog?language=${language}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to fetch posts.')
        return
      }

      setPosts(data.posts)
    } catch {
      setError('Eroare de conexiune. Este GITHUB_TOKEN configurat?')
    } finally {
      setLoading(false)
    }
  }, [language])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  async function handleDelete(post: PostEntry) {
    if (!confirm(`Ștergi "${post.title}"? Această acțiune nu poate fi anulată.`)) return

    setDeleting(post.filePath)

    try {
      const response = await fetch('/api/blog', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath: post.filePath,
          sha: post.sha,
          title: post.title,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        alert(data.error || 'Failed to delete post.')
        return
      }

      await fetchPosts()
    } catch {
      alert('Connection error.')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Postări Blog</h1>
          <p className="text-sm text-muted-foreground">Administrează conținutul blogului</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Language selector */}
          <div className="flex rounded-md border border-border">
            <button
              onClick={() => setLanguage('ro')}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                language === 'ro'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              RO
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                language === 'en'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              EN
            </button>
          </div>

          <Button onClick={() => router.push(`/admin/editor/new?language=${language}`)}>
            Postare nouă
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6">
        {loading && (
          <div className="py-12 text-center text-muted-foreground">Se încarcă postările...</div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="rounded-lg border border-border bg-muted/40 p-8 text-center">
            <p className="text-muted-foreground">
              Nu există postări încă. Creează prima postare!
            </p>
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className="divide-y divide-border rounded-lg border border-border">
            {posts.map((post) => (
              <div
                key={post.filePath}
                className="flex items-center justify-between gap-4 px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${
                        post.published ? 'bg-green-500' : 'bg-yellow-500'
                      }`}
                      title={post.published ? 'Published' : 'Draft'}
                    />
                    <p className="truncate font-medium text-foreground">{post.title}</p>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {post.date} · {post.slug}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(
                        `/admin/editor/${post.slug}?language=${language}&filename=${post.filename}`
                      )
                    }
                  >
                    Editează
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(post)}
                    disabled={deleting === post.filePath}
                    className="text-destructive hover:text-destructive"
                  >
                    {deleting === post.filePath ? '...' : 'Șterge'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
