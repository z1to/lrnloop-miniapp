<!-- src/App.vue -->
<template>
  <div class="app">
    <!-- Loading state with error -->
    <div v-if="store.currentScreen === 'loading'" class="screen screen--center">
      <template v-if="store.error">
        <p class="error-text">{{ store.error }}</p>
        <button class="btn-primary" @click="store.retryInit()">Try again</button>
      </template>
      <template v-else>
        <div class="spinner" />
        <p class="loading-text">Loading…</p>
      </template>
    </div>

    <!-- Active screen -->
    <Transition v-else name="slide" mode="out-in">
      <component :is="currentComponent" :key="store.currentScreen" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAppStore } from './store/app'
import ScreenWelcome from './components/ScreenWelcome.vue'
import ScreenWakeTime from './components/ScreenWakeTime.vue'
import ScreenTimezone from './components/ScreenTimezone.vue'
import ScreenTopic from './components/ScreenTopic.vue'
import ScreenDashboard from './components/ScreenDashboard.vue'

const store = useAppStore()

const screenMap = {
  loading: null,
  welcome: ScreenWelcome,
  'wake-time': ScreenWakeTime,
  timezone: ScreenTimezone,
  topic: ScreenTopic,
  dashboard: ScreenDashboard,
}

const currentComponent = computed(
  () => screenMap[store.currentScreen as keyof typeof screenMap]
)

onMounted(() => {
  store.init()
})
</script>

<style>
*, *::before, *::after { box-sizing: border-box; }

html, body {
  margin: 0;
  padding: 0;
  background: var(--tg-theme-bg-color, #fff);
  color: var(--tg-theme-text-color, #000);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.screen {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px 20px;
  min-height: 100vh;
}

.screen--center {
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--tg-theme-hint-color, #aaa);
  border-top-color: var(--tg-theme-button-color, #0088cc);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.error-text {
  color: #e44;
  text-align: center;
  font-size: 15px;
}

.btn-primary {
  background: var(--tg-theme-button-color, #0088cc);
  color: var(--tg-theme-button-text-color, #fff);
  border: none;
  border-radius: 10px;
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  max-width: 280px;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.slide-enter-from { opacity: 0; transform: translateX(20px); }
.slide-leave-to   { opacity: 0; transform: translateX(-20px); }

/* Shared typography */
.step-label {
  font-size: 12px;
  color: var(--tg-theme-hint-color, #888);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 4px;
}

.screen-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 24px;
  text-align: center;
}

.section-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--tg-theme-hint-color, #888);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 12px;
}

.inline-error {
  color: #e44;
  font-size: 13px;
  text-align: center;
  margin-top: 8px;
}

.loading-text {
  font-size: 14px;
  color: var(--tg-theme-hint-color, #888);
  margin-top: 12px;
}
</style>
