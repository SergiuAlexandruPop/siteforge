'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.error === 'Invalid password.' ? 'Parolă incorectă.' : (data.error || 'Autentificare eșuată.'))
        setLoading(false)
        return
      }

      router.push('/admin/dashboard')
    } catch {
      setError('Eroare de conexiune. Încercați din nou.')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-foreground">Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Introduceți parola pentru a accesa panoul de administrare.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-password" className="sr-only">
              Password
            </label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Parola"
              required
              autoFocus
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Se autentifică...' : 'Autentificare'}
          </Button>
        </form>
      </div>
    </div>
  )
}
