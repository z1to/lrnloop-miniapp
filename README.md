# lrnloop-miniapp

Telegram Mini App frontend for LrnLoop — a spaced-repetition learning assistant delivered via Telegram.

## What it does

Handles two user flows:

- **Onboarding** — new users set their wake time, timezone, and first learning topic
- **Dashboard** — returning users manage their topics and edit settings

## Stack

- Vue 3 + Vite + TypeScript
- Pinia (state machine — no Vue Router)
- Vitest + @vue/test-utils
- Deployed to GitHub Pages via GitHub Actions

## Architecture

A single `currentScreen` ref in the Pinia store drives which screen component is rendered. All API calls go through store actions — components never call the API directly.

```
App.vue
├── ScreenWelcome      — logo + "Get started"
├── ScreenWakeTime     — stepper + tap-to-edit input
├── ScreenTimezone     — scrollable list with live clocks
├── ScreenTopic        — text input + suggestion chips
└── ScreenDashboard    — topic list + settings
```

Auth: every request sends the Telegram `initData` string as `X-Telegram-Init-Data` — validated by the backend.

## Local development

```bash
cp .env.example .env
# Set VITE_API_BASE_URL to your backend URL

npm install
npm run dev
```

## Tests

```bash
npm test
```

## Live

`https://z1to.github.io/lrnloop-miniapp/`
