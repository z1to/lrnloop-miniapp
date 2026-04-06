// src/composables/useWakeTime.ts

/**
 * Parse a user-typed wake time string into "HH:MM" format.
 * Accepts: "7", "700", "730", "7:30", "07:00", "7am", "7pm", "7:30am", "7:30pm"
 * Returns null for unrecognisable input.
 */
export function parseWakeTime(raw: string): string | null {
  const s = raw.trim().toLowerCase()

  // "7:30am" / "7:30pm"
  const ampmFull = s.match(/^(\d{1,2}):(\d{2})(am|pm)$/)
  if (ampmFull) {
    let h = parseInt(ampmFull[1], 10)
    const m = parseInt(ampmFull[2], 10)
    if (ampmFull[3] === 'pm' && h !== 12) h += 12
    if (ampmFull[3] === 'am' && h === 12) h = 0
    if (h > 23 || m > 59) return null
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  }

  // "7am" / "7pm"
  const ampmShort = s.match(/^(\d{1,2})(am|pm)$/)
  if (ampmShort) {
    let h = parseInt(ampmShort[1], 10)
    if (ampmShort[2] === 'pm' && h !== 12) h += 12
    if (ampmShort[2] === 'am' && h === 12) h = 0
    if (h > 23) return null
    return `${String(h).padStart(2, '0')}:00`
  }

  // "7:30" / "07:30"
  const colonFmt = s.match(/^(\d{1,2}):(\d{2})$/)
  if (colonFmt) {
    const h = parseInt(colonFmt[1], 10)
    const m = parseInt(colonFmt[2], 10)
    if (h > 23 || m > 59) return null
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  }

  // "7", "12", "700", "730", "1230"
  if (/^\d{1,4}$/.test(s)) {
    const n = parseInt(s, 10)
    if (s.length <= 2) {
      if (n > 23) return null
      return `${String(n).padStart(2, '0')}:00`
    }
    const h = Math.floor(n / 100)
    const m = n % 100
    if (h > 23 || m > 59) return null
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  }

  return null
}

/**
 * Step a "HH:MM" time string by `deltaMinutes` (positive or negative).
 * Wraps around midnight.
 */
export function stepWakeTime(current: string, deltaMinutes: number): string {
  const [h, m] = current.split(':').map(Number)
  const total = h * 60 + m + deltaMinutes
  const wrapped = ((total % (24 * 60)) + 24 * 60) % (24 * 60)
  const newH = Math.floor(wrapped / 60)
  const newM = wrapped % 60
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`
}
