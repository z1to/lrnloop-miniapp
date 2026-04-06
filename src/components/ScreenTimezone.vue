<!-- src/components/ScreenTimezone.vue -->
<template>
  <div class="screen screen--timezone">
    <div class="screen-header">
      <p class="step-label">Step 2 of 3</p>
      <h2 class="screen-title">Pick the city closest to you</h2>
    </div>

    <div class="tz-list">
      <div
        v-for="tz in TIMEZONE_OPTIONS"
        :key="tz.iana"
        class="tz-row"
        :class="{ 'tz-row--selected': store.draft.timezone === tz.iana }"
        data-testid="tz-row"
        :data-iana="tz.iana"
        @click="selectTimezone(tz.iana)"
      >
        <div class="tz-left">
          <span class="tz-primary">{{ tz.primary }}</span>
          <span class="tz-secondary">{{ tz.secondary }}</span>
        </div>
        <div class="tz-right">
          <span class="tz-time">{{ liveTime(tz.iana) }}</span>
          <span class="tz-offset">{{ utcOffset(tz.iana) }}</span>
        </div>
      </div>
    </div>

    <div class="screen-footer">
      <button
        class="btn-primary"
        data-testid="next-btn"
        :disabled="!store.draft.timezone"
        @click="onNext"
      >
        {{ store.editContext === 'timezone-edit' ? 'Save' : 'Next →' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '../store/app'
import { TIMEZONE_OPTIONS, formatLocalTime, formatUtcOffset } from '../composables/useTimezone'

const store = useAppStore()

// Pre-select the browser's detected timezone synchronously before first render
// so the Next button is enabled from the start (falls back to first option)
if (!store.draft.timezone) {
  const detected = Intl.DateTimeFormat().resolvedOptions().timeZone
  const match = TIMEZONE_OPTIONS.find(tz => tz.iana === detected)
  store.setTimezoneDraft(match ? match.iana : TIMEZONE_OPTIONS[0].iana)
}

const now = ref(new Date())
let timer: ReturnType<typeof setInterval>

onMounted(() => {
  timer = setInterval(() => { now.value = new Date() }, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})

function liveTime(iana: string): string {
  return formatLocalTime(iana, now.value)
}

function utcOffset(iana: string): string {
  return formatUtcOffset(iana, now.value)
}

function selectTimezone(iana: string) {
  store.setTimezoneDraft(iana)
}

function onNext() {
  store.advanceFromTimezone()
}
</script>

<style scoped>
.screen--timezone {
  padding: 0;
}

.screen-header {
  text-align: center;
  padding: 24px 20px 16px;
}

.tz-list {
  flex: 1;
  overflow-y: auto;
  border-top: 1px solid var(--tg-theme-secondary-bg-color, #f0f0f0);
}

.tz-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid var(--tg-theme-secondary-bg-color, #f0f0f0);
  cursor: pointer;
  transition: background 0.15s;
}

.tz-row--selected {
  background: color-mix(in srgb, var(--tg-theme-button-color, #0088cc) 10%, transparent);
  border-left: 3px solid var(--tg-theme-button-color, #0088cc);
}

.tz-left {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tz-primary {
  font-size: 15px;
  font-weight: 600;
}

.tz-secondary {
  font-size: 12px;
  color: var(--tg-theme-hint-color, #999);
}

.tz-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.tz-time {
  font-size: 15px;
  font-weight: 500;
}

.tz-offset {
  font-size: 11px;
  color: var(--tg-theme-hint-color, #999);
}

.screen-footer {
  padding: 16px 20px;
  display: flex;
  justify-content: center;
}
</style>
