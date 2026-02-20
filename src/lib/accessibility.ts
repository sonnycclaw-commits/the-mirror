/**
 * Accessibility Utilities (S5-T05)
 *
 * Utilities for accessible announcements and focus management.
 */

/**
 * Screen reader announcer
 * Creates a live region for dynamic announcements without visual impact.
 */
class ScreenReaderAnnouncer {
  private container: HTMLDivElement | null = null

  private getOrCreateContainer(): HTMLDivElement {
    if (this.container) return this.container

    if (typeof document === 'undefined') {
      // SSR fallback
      return null as any
    }

    this.container = document.createElement('div')
    this.container.setAttribute('aria-live', 'polite')
    this.container.setAttribute('aria-atomic', 'true')
    this.container.className = 'sr-only'
    this.container.style.cssText = `
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    `
    document.body.appendChild(this.container)
    return this.container
  }

  /**
   * Announce a message to screen readers
   */
  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    const container = this.getOrCreateContainer()
    if (!container) return

    container.setAttribute('aria-live', priority)

    // Clear and set with delay to trigger announcement
    container.textContent = ''
    setTimeout(() => {
      container.textContent = message
    }, 100)
  }

  /**
   * Cleanup - remove container from DOM
   */
  cleanup(): void {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container)
      this.container = null
    }
  }
}

export const announcer = new ScreenReaderAnnouncer()

/**
 * Announce a signal detection to screen readers
 */
export function announceSignal(domain: string, type: string): void {
  announcer.announce(`New insight detected: ${type} in your ${domain.toLowerCase()} patterns`)
}

/**
 * Announce a phase change
 */
export function announcePhaseChange(phase: string): void {
  announcer.announce(`Entering ${phase} phase`, 'assertive')
}

/**
 * Announce the mirror moment
 */
export function announceMirrorMoment(statement: string): void {
  announcer.announce(`The Mirror says: ${statement}`, 'assertive')
}

/**
 * Focus trap for modals
 */
export function trapFocus(element: HTMLElement): () => void {
  const focusableElements = element.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault()
        lastElement?.focus()
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault()
        firstElement?.focus()
      }
    }
  }

  element.addEventListener('keydown', handleKeyDown)
  firstElement?.focus()

  return () => {
    element.removeEventListener('keydown', handleKeyDown)
  }
}

/**
 * Reduce motion check
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Create reduced motion safe animation props
 */
export function safeAnimation<T extends object>(
  animationProps: T,
  reducedProps: Partial<T> = {}
): T {
  if (prefersReducedMotion()) {
    return { ...animationProps, ...reducedProps }
  }
  return animationProps
}
