'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import {
  EditorRoot,
  EditorContent,
  EditorBubble,
  EditorBubbleItem,
  useEditor,
} from 'novel'
import type { JSONContent } from 'novel'
import type { Editor } from '@tiptap/core'
import {
  StarterKit,
  TiptapImage,
  TiptapLink,
  TiptapUnderline,
  Placeholder,
  HighlightExtension,
  MarkdownExtension,
  HorizontalRule,
  TaskList,
  TaskItem,
} from 'novel/extensions'
import type { EditorView } from '@tiptap/pm/view'

// ---------------------------------------------------------------------------
// Image upload — sends file to /api/upload, inserts R2 URL into editor
// ---------------------------------------------------------------------------

function validateFile(file: File): boolean {
  if (!file.type.startsWith('image/')) {
    window.alert('Doar imagini sunt permise.')
    return false
  }
  if (file.size > 5 * 1024 * 1024) {
    window.alert('Imaginea este prea mare. Maxim 5MB.')
    return false
  }
  return true
}

async function uploadImageToR2(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({ error: 'Eroare la încărcare.' }))
    throw new Error(data.error || 'Eroare la încărcarea imaginii.')
  }

  const data = await response.json()
  return data.url
}

async function uploadAndInsert(file: File, view: EditorView, pos: number) {
  if (!validateFile(file)) return

  try {
    const url = await uploadImageToR2(file)
    const { schema } = view.state
    const imageNode = schema.nodes.image?.create({
      src: url,
      'data-size': 'medium',
      'data-align': 'center',
    })
    if (!imageNode) return

    const tr = view.state.tr.insert(pos, imageNode)
    view.dispatch(tr)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare la încărcarea imaginii.'
    window.alert(message)
  }
}

// ---------------------------------------------------------------------------
// Custom Image extension — adds data-size and data-align attributes
// ---------------------------------------------------------------------------

const CustomImage = TiptapImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      'data-size': {
        default: 'medium',
        parseHTML: (element: HTMLElement) => element.getAttribute('data-size') || 'medium',
        renderHTML: (attributes: Record<string, string>) => {
          return { 'data-size': attributes['data-size'] || 'medium' }
        },
      },
      'data-align': {
        default: 'center',
        parseHTML: (element: HTMLElement) => element.getAttribute('data-align') || 'center',
        renderHTML: (attributes: Record<string, string>) => {
          return { 'data-align': attributes['data-align'] || 'center' }
        },
      },
    }
  },
}).configure({
  allowBase64: true,
  HTMLAttributes: { class: 'sf-image' },
})

// ---------------------------------------------------------------------------
// Extensions configuration
// ---------------------------------------------------------------------------

const extensions = [
  StarterKit.configure({
    heading: { levels: [2, 3, 4] },
    bulletList: { HTMLAttributes: { class: 'list-disc ml-4' } },
    orderedList: { HTMLAttributes: { class: 'list-decimal ml-4' } },
    codeBlock: { HTMLAttributes: { class: 'bg-muted rounded-md p-4 font-mono text-sm' } },
    blockquote: { HTMLAttributes: { class: 'border-l-4 border-primary pl-4 italic' } },
  }),
  CustomImage,
  TiptapLink.configure({
    HTMLAttributes: { class: 'text-primary underline underline-offset-4' },
    openOnClick: false,
  }),
  TiptapUnderline,
  Placeholder.configure({
    placeholder: 'Scrie conținutul postării... Poți trage imagini direct aici.',
  }),
  HighlightExtension.configure({ multicolor: true }),
  MarkdownExtension.configure({
    html: true,
    transformCopiedText: true,
    transformPastedText: true,
  }),
  HorizontalRule,
  TaskList,
  TaskItem.configure({ nested: true }),
]

// ---------------------------------------------------------------------------
// SVG Icons
// ---------------------------------------------------------------------------

function IconBold() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8" />
    </svg>
  )
}

function IconItalic() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" x2="10" y1="4" y2="4" /><line x1="14" x2="5" y1="20" y2="20" /><line x1="15" x2="9" y1="4" y2="20" />
    </svg>
  )
}

function IconUnderline() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4v6a6 6 0 0 0 12 0V4" /><line x1="4" x2="20" y1="20" y2="20" />
    </svg>
  )
}

function IconStrike() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4H9a3 3 0 0 0-2.83 4" /><path d="M14 12a4 4 0 0 1 0 8H6" /><line x1="4" x2="20" y1="12" y2="12" />
    </svg>
  )
}

function IconCode() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  )
}

function IconBulletList() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" x2="21" y1="6" y2="6" /><line x1="8" x2="21" y1="12" y2="12" /><line x1="8" x2="21" y1="18" y2="18" />
      <circle cx="3" cy="6" r="1" fill="currentColor" /><circle cx="3" cy="12" r="1" fill="currentColor" /><circle cx="3" cy="18" r="1" fill="currentColor" />
    </svg>
  )
}

function IconOrderedList() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="10" x2="21" y1="6" y2="6" /><line x1="10" x2="21" y1="12" y2="12" /><line x1="10" x2="21" y1="18" y2="18" />
      <path d="M4 6h1v4" /><path d="M4 10h2" /><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
    </svg>
  )
}

function IconQuote() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21" />
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3" />
    </svg>
  )
}

function IconLink() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

function IconHorizontalRule() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="2" x2="22" y1="12" y2="12" />
    </svg>
  )
}

function IconImage() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  )
}

function IconCodeBlock() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" /><path d="m10 10-2 2 2 2" /><path d="m14 14 2-2-2-2" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Toolbar button & separator
// ---------------------------------------------------------------------------

function ToolbarBtn({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void
  active?: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault()
        onClick()
      }}
      title={title}
      className={`inline-flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-muted ${
        active ? 'bg-muted text-foreground' : 'text-muted-foreground'
      }`}
    >
      {children}
    </button>
  )
}

function ToolbarSep() {
  return <div className="mx-0.5 h-6 w-px bg-border" />
}

// ---------------------------------------------------------------------------
// Image floating toolbar — appears when an image is selected
// ---------------------------------------------------------------------------

interface ImageToolbarState {
  visible: boolean
  top: number
  left: number
  size: string
  align: string
}

function ImageFloatingToolbar({ editor }: { editor: Editor }) {
  const [state, setState] = useState<ImageToolbarState>({
    visible: false,
    top: 0,
    left: 0,
    size: 'medium',
    align: 'center',
  })

  const updateToolbar = useCallback(() => {
    if (!editor) return

    const { selection } = editor.state
    const node = editor.state.doc.nodeAt(selection.from)

    if (node?.type.name === 'image') {
      // Find the DOM element for positioning
      const dom = editor.view.nodeDOM(selection.from) as HTMLElement | null
      if (dom) {
        const editorRect = editor.view.dom.closest('.novel-editor')?.getBoundingClientRect()
        const imgRect = dom.getBoundingClientRect()

        if (editorRect) {
          setState({
            visible: true,
            top: imgRect.top - editorRect.top - 44,
            left: imgRect.left - editorRect.left + imgRect.width / 2,
            size: node.attrs['data-size'] || 'medium',
            align: node.attrs['data-align'] || 'center',
          })
          return
        }
      }
    }

    setState((prev) => (prev.visible ? { ...prev, visible: false } : prev))
  }, [editor])

  useEffect(() => {
    if (!editor) return

    editor.on('selectionUpdate', updateToolbar)
    editor.on('transaction', updateToolbar)

    return () => {
      editor.off('selectionUpdate', updateToolbar)
      editor.off('transaction', updateToolbar)
    }
  }, [editor, updateToolbar])

  function setImageAttr(attr: string, value: string) {
    editor.chain().focus().updateAttributes('image', { [attr]: value }).run()
  }

  if (!state.visible) return null

  const sizes = [
    { value: 'small', label: 'Mic' },
    { value: 'medium', label: 'Mediu' },
    { value: 'full', label: 'Lat' },
  ]

  const aligns = [
    { value: 'left', label: '◧' },
    { value: 'center', label: '◫' },
    { value: 'right', label: '◨' },
  ]

  return (
    <div
      className="absolute z-40 flex items-center gap-1 rounded-lg border border-border bg-background px-1.5 py-1 shadow-lg"
      style={{
        top: `${state.top}px`,
        left: `${state.left}px`,
        transform: 'translateX(-50%)',
      }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {/* Size buttons */}
      {sizes.map((s) => (
        <button
          key={s.value}
          type="button"
          onMouseDown={(e) => {
            e.preventDefault()
            setImageAttr('data-size', s.value)
          }}
          className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
            state.size === s.value
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          {s.label}
        </button>
      ))}

      <div className="mx-1 h-5 w-px bg-border" />

      {/* Align buttons */}
      {aligns.map((a) => (
        <button
          key={a.value}
          type="button"
          onMouseDown={(e) => {
            e.preventDefault()
            setImageAttr('data-align', a.value)
          }}
          className={`rounded px-2 py-1 text-xs transition-colors ${
            state.align === a.value
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          {a.label}
        </button>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Fixed toolbar
// ---------------------------------------------------------------------------

function EditorToolbar({ editor }: { editor: Editor }) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  function addLink() {
    const previousUrl = editor.getAttributes('link').href ?? ''
    const url = window.prompt('URL:', previousUrl)
    if (url === null) return
    if (url === '') {
      editor.chain().focus().unsetLink().run()
    } else {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  function handleImageClick() {
    fileInputRef.current?.click()
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    const pos = editor.state.selection.anchor
    await uploadAndInsert(file, editor.view, pos)
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-input bg-muted/30 px-2 py-1.5">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Headings */}
      <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Titlu mare (H2)"><span className="text-xs font-bold">H2</span></ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Titlu mediu (H3)"><span className="text-xs font-bold">H3</span></ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} active={editor.isActive('heading', { level: 4 })} title="Titlu mic (H4)"><span className="text-xs font-bold">H4</span></ToolbarBtn>

      <ToolbarSep />

      <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Îngroșat (Ctrl+B)"><IconBold /></ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic (Ctrl+I)"><IconItalic /></ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Subliniat (Ctrl+U)"><IconUnderline /></ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Tăiat"><IconStrike /></ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Cod inline"><IconCode /></ToolbarBtn>

      <ToolbarSep />

      <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Listă cu puncte"><IconBulletList /></ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Listă numerotată"><IconOrderedList /></ToolbarBtn>

      <ToolbarSep />

      <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Citat"><IconQuote /></ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Bloc de cod"><IconCodeBlock /></ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Linie orizontală"><IconHorizontalRule /></ToolbarBtn>

      <ToolbarSep />

      <ToolbarBtn onClick={addLink} active={editor.isActive('link')} title="Adaugă link"><IconLink /></ToolbarBtn>
      <ToolbarBtn onClick={handleImageClick} title="Încarcă imagine"><IconImage /></ToolbarBtn>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Bubble menu
// ---------------------------------------------------------------------------

function BubbleMenuContent() {
  const { editor } = useEditor()
  if (!editor) return null

  const items = [
    { icon: <IconBold />, command: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold') },
    { icon: <IconItalic />, command: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic') },
    { icon: <IconUnderline />, command: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive('underline') },
    { icon: <IconStrike />, command: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive('strike') },
    { icon: <IconCode />, command: () => editor.chain().focus().toggleCode().run(), active: editor.isActive('code') },
  ]

  return (
    <>
      {items.map((item, i) => (
        <EditorBubbleItem key={i} onSelect={item.command}>
          <span className={`inline-flex h-8 w-8 items-center justify-center text-sm transition-colors hover:bg-muted ${item.active ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}>
            {item.icon}
          </span>
        </EditorBubbleItem>
      ))}
    </>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface NovelEditorProps {
  initialContent: string
  onChange: (markdown: string) => void
}

export function NovelEditor({ initialContent, onChange }: NovelEditorProps) {
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const [editorInstance, setEditorInstance] = useState<Editor | null>(null)
  const [, setTick] = useState(0)

  const content = initialContent.trim()
    ? (initialContent as unknown as JSONContent)
    : undefined

  return (
    <div className="rounded-md border border-input shadow-sm overflow-hidden focus-within:ring-1 focus-within:ring-ring">
      {editorInstance && <EditorToolbar editor={editorInstance} />}

      <EditorRoot>
        <div className="relative">
          {/* Image floating toolbar — positioned absolutely relative to editor */}
          {editorInstance && <ImageFloatingToolbar editor={editorInstance} />}

          <EditorContent
            className="novel-editor min-h-[400px] bg-transparent p-4 prose prose-sm max-w-none dark:prose-invert"
            extensions={extensions}
            initialContent={content}
            editorProps={{
              handleDrop: (view, event, _slice, moved) => {
                if (!moved && event.dataTransfer?.files.length) {
                  event.preventDefault()
                  const file = event.dataTransfer.files[0]
                  const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })
                  if (file && pos) {
                    uploadAndInsert(file, view, pos.pos)
                  }
                  return true
                }
                return false
              },
              handlePaste: (view, event) => {
                if (event.clipboardData?.files.length) {
                  event.preventDefault()
                  const file = event.clipboardData.files[0]
                  const pos = view.state.selection.from
                  if (file) {
                    uploadAndInsert(file, view, pos)
                  }
                  return true
                }
                return false
              },
              attributes: {
                class: 'outline-none min-h-[350px]',
              },
            }}
            onCreate={({ editor }) => {
              if (initialContent.trim()) {
                editor.commands.setContent(initialContent)
              }
              setEditorInstance(editor)
            }}
            onUpdate={({ editor }) => {
              const md = editor.storage.markdown?.getMarkdown?.() ?? ''
              onChangeRef.current(md)
              setTick((t) => t + 1)
            }}
            onSelectionUpdate={() => {
              setTick((t) => t + 1)
            }}
          >
            <EditorBubble className="flex items-center overflow-hidden rounded-md border border-border bg-background shadow-md">
              <BubbleMenuContent />
            </EditorBubble>
          </EditorContent>
        </div>
      </EditorRoot>
    </div>
  )
}
