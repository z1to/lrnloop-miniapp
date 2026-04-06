// src/composables/__tests__/useWakeTime.test.ts
import { describe, it, expect } from 'vitest'
import { parseWakeTime, stepWakeTime } from '../useWakeTime'

describe('parseWakeTime', () => {
  it('parses bare hour: "7" → "07:00"', () => {
    expect(parseWakeTime('7')).toBe('07:00')
  })
  it('parses bare hour: "12" → "12:00"', () => {
    expect(parseWakeTime('12')).toBe('12:00')
  })
  it('parses 3-digit: "730" → "07:30"', () => {
    expect(parseWakeTime('730')).toBe('07:30')
  })
  it('parses 4-digit: "1230" → "12:30"', () => {
    expect(parseWakeTime('1230')).toBe('12:30')
  })
  it('parses "700" → "07:00"', () => {
    expect(parseWakeTime('700')).toBe('07:00')
  })
  it('parses colon format: "7:30" → "07:30"', () => {
    expect(parseWakeTime('7:30')).toBe('07:30')
  })
  it('parses colon format: "07:00" → "07:00"', () => {
    expect(parseWakeTime('07:00')).toBe('07:00')
  })
  it('parses "7am" → "07:00"', () => {
    expect(parseWakeTime('7am')).toBe('07:00')
  })
  it('parses "7pm" → "19:00"', () => {
    expect(parseWakeTime('7pm')).toBe('19:00')
  })
  it('parses "7:30am" → "07:30"', () => {
    expect(parseWakeTime('7:30am')).toBe('07:30')
  })
  it('parses "7:30pm" → "19:30"', () => {
    expect(parseWakeTime('7:30pm')).toBe('19:30')
  })
  it('parses "12pm" (noon) → "12:00"', () => {
    expect(parseWakeTime('12pm')).toBe('12:00')
  })
  it('parses "12am" (midnight) → "00:00"', () => {
    expect(parseWakeTime('12am')).toBe('00:00')
  })
  it('returns null for nonsense input', () => {
    expect(parseWakeTime('banana')).toBeNull()
  })
  it('returns null for out-of-range hour: "25"', () => {
    expect(parseWakeTime('25')).toBeNull()
  })
  it('returns null for out-of-range minutes: "760"', () => {
    expect(parseWakeTime('760')).toBeNull()
  })
  it('trims whitespace', () => {
    expect(parseWakeTime('  7am  ')).toBe('07:00')
  })
})

describe('stepWakeTime', () => {
  it('steps forward by 30 min', () => {
    expect(stepWakeTime('07:00', 30)).toBe('07:30')
  })
  it('steps back by 30 min', () => {
    expect(stepWakeTime('07:00', -30)).toBe('06:30')
  })
  it('wraps forward past midnight', () => {
    expect(stepWakeTime('23:30', 30)).toBe('00:00')
  })
  it('wraps back past midnight', () => {
    expect(stepWakeTime('00:00', -30)).toBe('23:30')
  })
  it('steps by 60 min', () => {
    expect(stepWakeTime('06:00', 60)).toBe('07:00')
  })
})
