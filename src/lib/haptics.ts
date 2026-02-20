/**
 * Haptics Module (S1-T04)
 *
 * Provides haptic feedback for mobile devices.
 * Gracefully degrades on devices without vibration support.
 */

/**
 * Trigger haptic feedback for signal detection
 * Short pulse pattern: tap-pause-tap
 */
export function hapticSignal(): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([30, 50, 30])
    } catch {
      // Vibration not supported or blocked
    }
  }
}

/**
 * Trigger haptic feedback for phase transition
 * Longer pattern: tap-pause-tap-pause-tap
 */
export function hapticPhaseTransition(): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([40, 60, 40, 60, 40])
    } catch {
      // Vibration not supported or blocked
    }
  }
}

/**
 * Trigger haptic feedback for Mirror Moment (climax)
 * Strong single pulse
 */
export function hapticMirrorMoment(): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(100)
    } catch {
      // Vibration not supported or blocked
    }
  }
}

/**
 * Cancel any ongoing vibration
 */
export function cancelHaptic(): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(0)
    } catch {
      // Ignore
    }
  }
}
