/**
 * Spring Physics - The Tension System
 *
 * From visual-identity.md: "We do not use duration-300 or ease-in-out.
 * We use Spring Physics. Things should feel like they have mass and friction."
 */

export type SpringType = 'snappy' | 'float' | 'reveal' | 'elastic' | 'gentle'

/**
 * The Tension System - Spring configurations for different contexts
 */
export const springs = {
  /** Fast, precise, zero bounce - for inputs/toggles */
  snappy: { stiffness: 400, damping: 30 },

  /** Confident entry, slight settle - for cards/modals */
  float: { stiffness: 250, damping: 25 },

  /** Slow, majestic, heavy - for reveals/insights */
  reveal: { stiffness: 120, damping: 20 },

  /** For scrolling bounce-back */
  elastic: { stiffness: 200, damping: 20 },

  /** Soft, subtle - for background elements */
  gentle: { stiffness: 100, damping: 15 },
} as const

/**
 * Convert to framer-motion spring transition format
 */
export function springTransition(type: SpringType) {
  return {
    type: 'spring' as const,
    ...springs[type],
  }
}

/**
 * Stagger configuration for sequential animations
 */
export function staggerChildren(delayPerChild: number = 0.05) {
  return {
    staggerChildren: delayPerChild,
    delayChildren: 0.1,
  }
}

/**
 * Stagger variant for parent containers
 */
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
}

/**
 * Stagger variant for child items (fade up)
 */
export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springTransition('float'),
  },
}

/**
 * Reveal from center (for insights/mirror moments)
 */
export const revealFromCenter = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springTransition('reveal'),
  },
}
