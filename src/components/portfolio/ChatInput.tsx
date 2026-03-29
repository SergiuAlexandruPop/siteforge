'use client'

import { useState } from 'react'

interface ChatInputProps {
  language?: 'ro' | 'en'
  className?: string
}

const labels = {
  ro: {
    placeholder: 'Scrie un mesaj...',
    send: 'Trimite',
    sending: 'Se trimite...',
    success: 'Mesaj trimis!',
    error: 'Eroare. Încearcă din nou.',
  },
  en: {
    placeholder: 'Type a message...',
    send: 'Send',
    sending: 'Sending...',
    success: 'Message sent!',
    error: 'Error. Try again.',
  },
}

export function ChatInput({ language = 'ro', className = '' }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const t = labels[language]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim() || status === 'loading') return

    setStatus('loading')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim() }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error('Failed to send')
      }

      setStatus('success')
      setMessage('')
      setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`mx-auto w-full max-w-2xl ${className}`}
    >
      <div className="relative rounded-2xl border border-border bg-background shadow-sm transition-colors dark:border-border/50 dark:bg-muted/30">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t.placeholder}
          rows={3}
          className="w-full resize-none rounded-2xl bg-transparent px-4 pt-4 pb-14 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none sm:text-base"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(e)
            }
          }}
        />

        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          {status === 'success' && (
            <span className="text-xs text-green-600 dark:text-green-400">{t.success}</span>
          )}
          {status === 'error' && (
            <span className="text-xs text-red-600 dark:text-red-400">{t.error}</span>
          )}

          <button
            type="submit"
            disabled={status === 'loading' || !message.trim()}
            className="inline-flex h-11 min-w-[80px] items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed dark:shadow-[var(--glow-primary)]"
          >
            {status === 'loading' ? t.sending : t.send}
          </button>
        </div>
      </div>
    </form>
  )
}
