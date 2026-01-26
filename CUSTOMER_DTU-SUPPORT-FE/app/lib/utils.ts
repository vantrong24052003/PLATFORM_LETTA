import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import DOMPurify from 'dompurify'
import type { HandleKeyOptions } from '@/types/common'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') {
    return html
  }
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'div', 'span', 'button', 'img'],
    ALLOWED_ATTR: ['class', 'href', 'target', 'rel', 'src', 'alt', 'data-*'],
    ALLOW_DATA_ATTR: true,
  })
}

export function handleKey(event: KeyboardEvent, callback: () => void, options: HandleKeyOptions = {}): void {
  const { key, shiftKey, ctrlKey, altKey, metaKey, preventDefault = true } = options

  if (!key) {
    return
  }

  const keys = Array.isArray(key) ? key : [key]
  const matchesKey = keys.includes(event.key)

  if (!matchesKey) {
    return
  }

  const matchesShift = shiftKey == null || event.shiftKey === shiftKey
  const matchesCtrl = ctrlKey == null || event.ctrlKey === ctrlKey
  const matchesAlt = altKey == null || event.altKey === altKey
  const matchesMeta = metaKey == null || event.metaKey === metaKey

  if (matchesShift && matchesCtrl && matchesAlt && matchesMeta) {
    callback()
    if (preventDefault) {
      event.preventDefault()
    }
  }
}
