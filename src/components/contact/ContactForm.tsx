'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  message?: string
}

interface ContactFormProps {
  language?: 'ro' | 'en'
}

const i18n = {
  ro: {
    nameLabel: 'Nume *',
    namePlaceholder: 'Numele dumneavoastră',
    nameError: 'Numele trebuie să aibă cel puțin 2 caractere.',
    emailLabel: 'Email *',
    emailPlaceholder: 'email@exemplu.ro',
    emailError: 'Introduceți o adresă de email validă.',
    phoneLabel: 'Telefon',
    phoneOptional: '(opțional)',
    phonePlaceholder: '+40 700 000 000',
    phoneError: 'Numărul de telefon trebuie să aibă cel puțin 6 cifre.',
    messageLabel: 'Mesaj *',
    messagePlaceholder: 'Scrieți mesajul dumneavoastră aici...',
    messageError: 'Mesajul trebuie să aibă cel puțin 10 caractere.',
    submit: 'Trimite mesajul',
    submitting: 'Se trimite...',
    successTitle: 'Mesajul a fost trimis cu succes!',
    successSubtitle: 'Vă vom răspunde cât mai curând posibil.',
    sendAnother: 'Trimite alt mesaj',
    genericError: 'A apărut o eroare. Încercați din nou.',
  },
  en: {
    nameLabel: 'Name *',
    namePlaceholder: 'Your name',
    nameError: 'Name must be at least 2 characters.',
    emailLabel: 'Email *',
    emailPlaceholder: 'email@example.com',
    emailError: 'Please enter a valid email address.',
    phoneLabel: 'Phone',
    phoneOptional: '(optional)',
    phonePlaceholder: '+40 700 000 000',
    phoneError: 'Phone number must have at least 6 digits.',
    messageLabel: 'Message *',
    messagePlaceholder: 'Write your message here...',
    messageError: 'Message must be at least 10 characters.',
    submit: 'Send message',
    submitting: 'Sending...',
    successTitle: 'Message sent successfully!',
    successSubtitle: 'We will get back to you as soon as possible.',
    sendAnother: 'Send another message',
    genericError: 'An error occurred. Please try again.',
  },
}

function validateForm(
  data: { name: string; email: string; phone: string; message: string },
  t: typeof i18n.ro
): FormErrors {
  const errors: FormErrors = {}

  if (data.name.trim().length < 2) {
    errors.name = t.nameError
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(data.email.trim())) {
    errors.email = t.emailError
  }

  if (data.phone.trim() && data.phone.replace(/\D/g, '').length < 6) {
    errors.phone = t.phoneError
  }

  if (data.message.trim().length < 10) {
    errors.message = t.messageError
  }

  return errors
}

export function ContactForm({ language = 'ro' }: ContactFormProps) {
  const t = i18n[language]
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Client-side validation
    const formErrors = validateForm({ name, email, phone, message }, t)
    setErrors(formErrors)
    if (Object.keys(formErrors).length > 0) return

    setStatus('loading')
    setServerError('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          message: message.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to send message.')
      }

      setStatus('success')
      setName('')
      setEmail('')
      setPhone('')
      setMessage('')
    } catch (err) {
      setStatus('error')
      setServerError(
        err instanceof Error ? err.message : t.genericError
      )
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center dark:border-green-900 dark:bg-green-950">
        <p className="text-lg font-medium text-green-800 dark:text-green-200">
          {t.successTitle}
        </p>
        <p className="mt-1 text-sm text-green-600 dark:text-green-400">
          {t.successSubtitle}
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => setStatus('idle')}
        >
          {t.sendAnother}
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Name */}
      <div>
        <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-foreground">
          {t.nameLabel}
        </label>
        <Input
          id="contact-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t.namePlaceholder}
          required
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-sm text-destructive">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-foreground">
          {t.emailLabel}
        </label>
        <Input
          id="contact-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.emailPlaceholder}
          required
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-sm text-destructive">{errors.email}</p>
        )}
      </div>

      {/* Phone (optional) */}
      <div>
        <label htmlFor="contact-phone" className="mb-1.5 block text-sm font-medium text-foreground">
          {t.phoneLabel} <span className="text-muted-foreground">{t.phoneOptional}</span>
        </label>
        <Input
          id="contact-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={t.phonePlaceholder}
          autoComplete="tel"
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
        />
        {errors.phone && (
          <p id="phone-error" className="mt-1 text-sm text-destructive">{errors.phone}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-foreground">
          {t.messageLabel}
        </label>
        <textarea
          id="contact-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t.messagePlaceholder}
          required
          rows={5}
          className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        {errors.message && (
          <p id="message-error" className="mt-1 text-sm text-destructive">{errors.message}</p>
        )}
      </div>

      {/* Server error */}
      {status === 'error' && serverError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {serverError}
        </div>
      )}

      {/* Submit */}
      <Button type="submit" disabled={status === 'loading'} className="w-full sm:w-auto">
        {status === 'loading' ? t.submitting : t.submit}
      </Button>
    </form>
  )
}
