'use client'

import { useState, useEffect, Suspense, lazy } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// Lazy-load Novel editor to avoid SSR issues and reduce initial bundle
const NovelEditor = lazy(() =>
  import('@/components/blog/NovelEditor').then((mod) => ({ default: mod.NovelEditor }))
)

interface PostMeta {
  title: string
  slug: string
  date: string
  author: string
  excerpt: string
  featuredImage: string
  published: boolean
  readingTime: number
  tags: string
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

function metaToFrontmatter(meta: PostMeta): string {
  const tags = meta.tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  return [
    '---',
    `title: "${meta.title}"`,
    `slug: "${meta.slug}"`,
    `date: "${meta.date}"`,
    `author: "${meta.author}"`,
    `excerpt: "${meta.excerpt}"`,
    `featuredImage: "${meta.featuredImage}"`,
    `published: ${meta.published}`,
    `readingTime: ${meta.readingTime}`,
    `tags: [${tags.map((t) => `"${t}"`).join(', ')}]`,
    '---',
  ].join('\n')
}

function parseFrontmatter(content: string): { meta: Partial<PostMeta>; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) return { meta: {}, body: content }

  const meta: Record<string, string> = {}
  for (const line of match[1].split('\n')) {
    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) continue
    const key = line.slice(0, colonIndex).trim()
    let value = line.slice(colonIndex + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    meta[key] = value
  }

  // Parse tags array
  const tagsMatch = match[1].match(/tags:\s*\[(.*?)\]/)
  const tags = tagsMatch
    ? tagsMatch[1].replace(/["']/g, '').split(',').map((t) => t.trim()).filter(Boolean).join(', ')
    : ''

  return {
    meta: {
      title: meta.title,
      slug: meta.slug,
      date: meta.date,
      author: meta.author,
      excerpt: meta.excerpt,
      featuredImage: meta.featuredImage,
      published: meta.published !== 'false',
      readingTime: parseInt(meta.readingTime ?? '3', 10),
      tags,
    },
    body: match[2].trim(),
  }
}

export default function EditorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const language = searchParams.get('language') ?? 'ro'
  const existingFilename = searchParams.get('filename')
  const isNew = !existingFilename

  const [meta, setMeta] = useState<PostMeta>({
    title: '',
    slug: '',
    date: new Date().toISOString().slice(0, 10),
    author: 'Alex',
    excerpt: '',
    featuredImage: '',
    published: false,
    readingTime: 3,
    tags: '',
  })
  const [body, setBody] = useState('')
  const [sha, setSha] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(!isNew)
  const [error, setError] = useState('')
  const [autoSlug, setAutoSlug] = useState(true)
  const [editorReady, setEditorReady] = useState(false)
  const [useMarkdown, setUseMarkdown] = useState(false)

  // Load existing post
  useEffect(() => {
    if (isNew || !existingFilename) {
      setEditorReady(true)
      return
    }

    async function loadPost() {
      try {
        // Fetch post list to get sha
        const response = await fetch(`/api/blog?language=${language}`)
        const data = await response.json()

        if (!response.ok) {
          setError('Nu s-a putut încărca postarea.')
          setLoading(false)
          setEditorReady(true)
          return
        }

        const post = data.posts.find((p: { filename: string }) => p.filename === existingFilename)
        if (!post) {
          setError('Postarea nu a fost găsită.')
          setLoading(false)
          setEditorReady(true)
          return
        }

        // Fetch the actual file content
        const fileResponse = await fetch(
          `/api/blog/file?path=${encodeURIComponent(post.filePath)}`
        )

        if (!fileResponse.ok) {
          setSha(post.sha)
          setMeta((prev) => ({
            ...prev,
            title: post.title,
            slug: post.slug,
            date: post.date,
            published: post.published,
          }))
          setAutoSlug(false)
          setLoading(false)
          setEditorReady(true)
          return
        }

        const fileData = await fileResponse.json()
        const parsed = parseFrontmatter(fileData.content)

        setMeta({
          title: parsed.meta.title ?? '',
          slug: parsed.meta.slug ?? '',
          date: parsed.meta.date ?? '',
          author: parsed.meta.author ?? 'Alex',
          excerpt: parsed.meta.excerpt ?? '',
          featuredImage: parsed.meta.featuredImage ?? '',
          published: parsed.meta.published ?? false,
          readingTime: parsed.meta.readingTime ?? 3,
          tags: parsed.meta.tags ?? '',
        })
        setBody(parsed.body)
        setSha(fileData.sha)
        setAutoSlug(false)
      } catch {
        setError('Nu s-a putut încărca postarea.')
      } finally {
        setLoading(false)
        setEditorReady(true)
      }
    }

    loadPost()
  }, [isNew, existingFilename, language])

  function updateMeta(field: keyof PostMeta, value: string | boolean | number) {
    setMeta((prev) => {
      const updated = { ...prev, [field]: value }
      if (field === 'title' && autoSlug) {
        updated.slug = generateSlug(value as string)
      }
      return updated
    })
  }

  async function handleSave() {
    if (!meta.title.trim()) {
      setError('Titlul este obligatoriu.')
      return
    }
    if (!meta.slug.trim()) {
      setError('Slug-ul este obligatoriu.')
      return
    }

    setSaving(true)
    setError('')

    try {
      const frontmatter = metaToFrontmatter(meta)
      const fullContent = `${frontmatter}\n\n${body}`
      const filename = existingFilename ?? `${meta.slug}.md`

      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename,
          content: fullContent,
          sha: sha ?? undefined,
          language,
          title: meta.title,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Nu s-a putut salva postarea.')
        return
      }

      router.push('/admin/dashboard')
    } catch {
      setError('Eroare de conexiune.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Se încarcă postarea...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.push('/admin/dashboard')}>
          ← Înapoi
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground uppercase">{language}</span>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={meta.published}
              onChange={(e) => updateMeta('published', e.target.checked)}
              className="rounded"
            />
            Publicat
          </label>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Se salvează...' : isNew ? 'Creează postarea' : 'Salvează modificările'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Metadata fields */}
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Titlu *</label>
          <Input
            value={meta.title}
            onChange={(e) => updateMeta('title', e.target.value)}
            placeholder="Titlul postării"
            className="text-lg font-semibold"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Slug (URL) *</label>
            <Input
              value={meta.slug}
              onChange={(e) => {
                setAutoSlug(false)
                updateMeta('slug', e.target.value)
              }}
              placeholder="post-url-slug"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Data</label>
            <Input
              type="date"
              value={meta.date}
              onChange={(e) => updateMeta('date', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Descriere scurtă</label>
          <Input
            value={meta.excerpt}
            onChange={(e) => updateMeta('excerpt', e.target.value)}
            placeholder="Descriere scurtă pentru carduri și SEO"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Autor</label>
            <Input
              value={meta.author}
              onChange={(e) => updateMeta('author', e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Timp de citire (min)</label>
            <Input
              type="number"
              value={meta.readingTime}
              onChange={(e) => updateMeta('readingTime', parseInt(e.target.value) || 1)}
              min={1}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Etichete</label>
            <Input
              value={meta.tags}
              onChange={(e) => updateMeta('tags', e.target.value)}
              placeholder="tech, ai, sănătate"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Imagine principală (URL)</label>
          <Input
            value={meta.featuredImage}
            onChange={(e) => updateMeta('featuredImage', e.target.value)}
            placeholder="https://pub-xxxxx.r2.dev/blog/image.webp"
          />
        </div>

        {/* Editor toggle + content area */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="block text-sm font-medium">Conținut</label>
            <button
              type="button"
              onClick={() => setUseMarkdown(!useMarkdown)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {useMarkdown ? '← Editor vizual' : 'Editare Markdown →'}
            </button>
          </div>

          {useMarkdown ? (
            /* Markdown textarea fallback */
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={20}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono"
              placeholder="Scrie conținutul postării în format markdown..."
            />
          ) : (
            /* Novel WYSIWYG editor */
            editorReady && (
              <Suspense
                fallback={
                  <div className="flex min-h-[400px] items-center justify-center rounded-md border border-input">
                    <p className="text-sm text-muted-foreground">Se încarcă editorul...</p>
                  </div>
                }
              >
                <NovelEditor initialContent={body} onChange={setBody} />
              </Suspense>
            )
          )}
        </div>
      </div>
    </div>
  )
}
