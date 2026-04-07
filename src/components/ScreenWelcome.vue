<!-- src/components/ScreenWelcome.vue -->
<template>
  <div class="screen screen--center">
    <div class="welcome-content">
      <div class="welcome-emoji">🧠</div>
      <h1 class="welcome-title">Lrnloop</h1>
      <p class="welcome-pitch">Science-backed learning<br>delivered throughout your day.</p>
    </div>
    <button class="btn-primary" @click="store.navigate('wake-time')">
      Get started →
    </button>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '../store/app'
const store = useAppStore()
</script>

<style scoped>
.welcome-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 48px;
}

.welcome-emoji { font-size: 64px; }

.welcome-title {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.welcome-pitch {
  font-size: 16px;
  color: var(--tg-theme-hint-color, #666);
  text-align: center;
  line-height: 1.5;
}
</style>
