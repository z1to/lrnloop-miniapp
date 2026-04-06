// src/composables/useTimezone.ts

export interface TimezoneOption {
  primary: string
  secondary: string
  iana: string
}

export const TIMEZONE_OPTIONS: TimezoneOption[] = [
  { primary: 'Los Angeles', secondary: 'Vancouver · Denver',       iana: 'America/Los_Angeles' },
  { primary: 'New York',    secondary: 'Toronto · Miami',          iana: 'America/New_York'    },
  { primary: 'São Paulo',   secondary: 'Buenos Aires · Rio',       iana: 'America/Sao_Paulo'   },
  { primary: 'London',      secondary: 'Lisbon · Dublin',          iana: 'Europe/London'       },
  { primary: 'Paris',       secondary: 'Berlin · Madrid · Rome',   iana: 'Europe/Paris'        },
  { primary: 'Cairo',       secondary: 'Helsinki · Kyiv',          iana: 'Africa/Cairo'        },
  { primary: 'Istanbul',    secondary: 'Moscow · Nairobi',         iana: 'Europe/Istanbul'     },
  { primary: 'Mumbai',      secondary: 'New Delhi · Colombo',      iana: 'Asia/Kolkata'        },
  { primary: 'Bangkok',     secondary: 'Jakarta · Hanoi',          iana: 'Asia/Bangkok'        },
  { primary: 'Singapore',   secondary: 'Beijing · Perth · KL',     iana: 'Asia/Singapore'      },
  { primary: 'Tokyo',       secondary: 'Seoul · Osaka',            iana: 'Asia/Tokyo'          },
  { primary: 'Sydney',      secondary: 'Melbourne · Brisbane',     iana: 'Australia/Sydney'    },
  { primary: 'Auckland',    secondary: 'Fiji · Samoa',             iana: 'Pacific/Auckland'    },
]

/**
 * Format a Date as local time in the given IANA timezone.
 * Returns e.g. "2:34 PM"
 */
export function formatLocalTime(iana: string, now: Date): string {
  return now.toLocaleTimeString('en-US', {
    timeZone: iana,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

/**
 * Format the UTC offset for a given IANA timezone at a given moment.
 * Returns e.g. "GMT-5" or "GMT+5:30"
 */
export function formatUtcOffset(iana: string, now: Date): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: iana,
    timeZoneName: 'shortOffset',
  }).formatToParts(now)
  return parts.find(p => p.type === 'timeZoneName')?.value ?? ''
}

/**
 * Given an IANA timezone name, return the display primary city name.
 * Falls back to the IANA name itself for unknown zones.
 */
export function getPrimaryCity(iana: string): string {
  return TIMEZONE_OPTIONS.find(t => t.iana === iana)?.primary ?? iana
}
