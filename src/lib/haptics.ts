/**
 * Haptic Feedback Utility
 * Provides haptic feedback for mobile devices
 */

/**
 * Trigger haptic feedback on supported devices
 * @param type - Type of haptic feedback ('success', 'error', 'light', 'medium', 'heavy')
 */
export function triggerHaptic(type: 'success' | 'error' | 'light' | 'medium' | 'heavy' = 'light') {
  // Check if the device supports haptics
  if (typeof window === 'undefined') return

  try {
    // Vibration API (Android and some browsers)
    if ('vibrate' in navigator) {
      switch (type) {
        case 'success':
          navigator.vibrate([50, 30, 50])  // Double tap pattern
          break
        case 'error':
          navigator.vibrate([100, 50, 100, 50, 100])  // Triple tap pattern
          break
        case 'light':
          navigator.vibrate(10)
          break
        case 'medium':
          navigator.vibrate(30)
          break
        case 'heavy':
          navigator.vibrate(50)
          break
      }
    }

    // Haptic Engine API (iOS Safari) - removed duplicate, handled by vibration API above

    // iOS Haptic Feedback (experimental)
    // @ts-expect-error - iOS haptic feedback is not in TypeScript types
    if (window.TapticEngine) {
      switch (type) {
        case 'success':
          // @ts-expect-error - iOS haptic feedback is not in TypeScript types
          window.TapticEngine.notification({ type: 'success' })
          break
        case 'error':
          // @ts-expect-error - iOS haptic feedback is not in TypeScript types
          window.TapticEngine.notification({ type: 'error' })
          break
        case 'light':
          // @ts-expect-error - iOS haptic feedback is not in TypeScript types
          window.TapticEngine.impact({ style: 'light' })
          break
        case 'medium':
          // @ts-expect-error - iOS haptic feedback is not in TypeScript types
          window.TapticEngine.impact({ style: 'medium' })
          break
        case 'heavy':
          // @ts-expect-error - iOS haptic feedback is not in TypeScript types
          window.TapticEngine.impact({ style: 'heavy' })
          break
      }
    }
  } catch (error) {
    // Silently fail if haptics are not supported
    console.debug('Haptic feedback not supported:', error)
  }
}

/**
 * Trigger success haptic feedback
 */
export function hapticSuccess() {
  triggerHaptic('success')
}

/**
 * Trigger error haptic feedback
 */
export function hapticError() {
  triggerHaptic('error')
}

/**
 * Trigger light haptic feedback
 */
export function hapticLight() {
  triggerHaptic('light')
}

/**
 * Trigger medium haptic feedback
 */
export function hapticMedium() {
  triggerHaptic('medium')
}

/**
 * Trigger heavy haptic feedback
 */
export function hapticHeavy() {
  triggerHaptic('heavy')
}

