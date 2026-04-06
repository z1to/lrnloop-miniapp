// src/composables/__tests__/useTimezone.test.ts
import { describe, it, expect } from 'vitest'
import { TIMEZONE_OPTIONS, formatLocalTime, formatUtcOffset, getPrimaryCity } from '../useTimezone'

describe('TIMEZONE_OPTIONS', () => {
  it('has exactly 13 entries', () => {
    expect(TIMEZONE_OPTIONS).toHaveLength(13)
  })

  it('all entries have primary, secondary, and iana fields', () => {
    for (const tz of TIMEZONE_OPTIONS) {
      expect(tz).toHaveProperty('primary')
      expect(tz).toHaveProperty('secondary')
      expect(tz).toHaveProperty('iana')
      expect(tz.primary).toBeTruthy()
      expect(tz.iana).toBeTruthy()
    }
  })

  it('contains expected IANA names', () => {
    const ianaNames = TIMEZONE_OPTIONS.map(t => t.iana)
    expect(ianaNames).toContain('America/New_York')
    expect(ianaNames).toContain('Europe/London')
    expect(ianaNames).toContain('Asia/Kolkata')
    expect(ianaNames).toContain('Pacific/Auckland')
  })
})

describe('formatLocalTime', () => {
  it('formats a Date to local time string for a given IANA zone', () => {
    // UTC midnight = 7pm New York (EST, UTC-5)
    const utcMidnight = new Date('2024-01-15T00:00:00Z')
    const result = formatLocalTime('America/New_York', utcMidnight)
    // Should contain "7" and "PM"
    expect(result).toMatch(/7/)
    expect(result.toUpperCase()).toContain('PM')
  })

  it('returns a non-empty string', () => {
    const result = formatLocalTime('Asia/Tokyo', new Date())
    expect(result).toBeTruthy()
    expect(typeof result).toBe('string')
  })
})

describe('formatUtcOffset', () => {
  it('returns a string containing GMT or UTC', () => {
    const result = formatUtcOffset('America/New_York', new Date('2024-01-15T00:00:00Z'))
    expect(result).toMatch(/GMT|UTC/i)
  })

  it('returns a non-empty string for all zones', () => {
    const now = new Date()
    for (const tz of TIMEZONE_OPTIONS) {
      const result = formatUtcOffset(tz.iana, now)
      expect(result).toBeTruthy()
    }
  })
})

describe('getPrimaryCity', () => {
  it('returns the primary city for a known IANA name', () => {
    expect(getPrimaryCity('America/New_York')).toBe('New York')
    expect(getPrimaryCity('Asia/Kolkata')).toBe('Mumbai')
    expect(getPrimaryCity('Pacific/Auckland')).toBe('Auckland')
  })

  it('returns the IANA name itself for unknown zones', () => {
    expect(getPrimaryCity('Unknown/Zone')).toBe('Unknown/Zone')
  })
})
