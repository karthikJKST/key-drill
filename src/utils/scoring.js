/**
 * Small pure helpers for time and scores.
 * Keeping them separate makes them easy to read (and test) without React.
 */

/** Seconds -> "05:00" style clock (always two digits for both fields). */
export function formatClock(totalSeconds) {
  const safe = Math.max(0, Math.floor(totalSeconds))
  const minutes = Math.floor(safe / 60)
  const seconds = safe % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

/**
 * accuracy = correct / total valid keys * 100
 * Nothing typed yet -> 100% (nothing attempted, nothing wrong).
 */
export function accuracyOf(correct, total) {
  if (total === 0) return 100
  return (correct / total) * 100
}

/**
 * Characters per minute = valid keys typed / minutes practised.
 * Simple on purpose — no fancy analytics.
 */
export function cpmOf(total, elapsedSeconds) {
  if (elapsedSeconds <= 0) return 0
  return Math.round((total / elapsedSeconds) * 60)
}
