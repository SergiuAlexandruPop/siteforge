'use client'

import { useState, useEffect, useCallback } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// ---------------------------------------------------------------------------
// TypewriterText — Types out words character by character with a blinking cursor.
//
// Inspired by rocket.new — types a word, pauses, deletes it, then types the next.
// The cursor blinks at a steady rate while idle, stops blinking while typing.
//
// Accessibility:
//   - prefers-reduced-motion: shows the first word statically, no animation.
//   - aria-live="polite" announces word changes to screen readers.
// ---------------------------------------------------------------------------

interface TypewriterTextProps {
  /** Words to cycle through with typing animation. */
  words: string[]
  /** Milliseconds between each character typed. Default 80. */
  typingSpeed?: number
  /** Milliseconds between each character deleted. Default 50. */
  deletingSpeed?: number
  /** Milliseconds to pause after fully typing a word. Default 2000. */
  pauseDuration?: number
  /** Extra CSS classes for the container span. */
  className?: string
  /** Extra CSS classes for the cursor. */
  cursorClassName?: string
}

export function TypewriterText({
  words,
  typingSpeed = 80,
  deletingSpeed = 50,
  pauseDuration = 2000,
  className = '',
  cursorClassName = '',
}: TypewriterTextProps) {
  const prefersReduced = useReducedMotion()
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const tick = useCallback(() => {
    const currentWord = words[currentWordIndex]

    if (isPaused) return

    if (!isDeleting) {
      // Typing forward
      if (displayedText.length < currentWord.length) {
        setDisplayedText(currentWord.slice(0, displayedText.length + 1))
      } else {
        // Word fully typed — pause before deleting
        setIsPaused(true)
        setTimeout(() => {
          setIsPaused(false)
          setIsDeleting(true)
        }, pauseDuration)
      }
    } else {
      // Deleting
      if (displayedText.length > 0) {
        setDisplayedText(currentWord.slice(0, displayedText.length - 1))
      } else {
        // Word fully deleted — move to next
        setIsDeleting(false)
        setCurrentWordIndex((prev) => (prev + 1) % words.length)
      }
    }
  }, [words, currentWordIndex, displayedText, isDeleting, isPaused, pauseDuration])

  useEffect(() => {
    if (prefersReduced) return
    if (words.length === 0) return

    const speed = isDeleting ? deletingSpeed : typingSpeed
    const timer = setTimeout(tick, speed)
    return () => clearTimeout(timer)
  }, [tick, prefersReduced, words.length, isDeleting, typingSpeed, deletingSpeed])

  // Reduced motion: static first word, no animation.
  if (prefersReduced) {
    return <span className={className}>{words[0]}</span>
  }

  return (
    <span className={className} aria-live="polite">
      {displayedText}
      <span
        className={`inline-block w-[3px] ml-0.5 animate-blink ${cursorClassName}`}
        aria-hidden="true"
      >
        |
      </span>
    </span>
  )
}
