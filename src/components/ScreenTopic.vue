<!-- src/components/ScreenTopic.vue -->
<template>
  <div class="screen">
    <div class="screen-header">
      <p class="step-label">Step 3 of 3</p>
      <h2 class="screen-title">What do you want to learn?</h2>
    </div>

    <input
      v-model="topicTitle"
      class="topic-input"
      data-testid="topic-input"
      type="text"
      placeholder="e.g. stoic philosophy"
      maxlength="200"
      @keydown.enter="onSubmit"
    />

    <div class="chips">
      <button
        v-for="chip in SUGGESTIONS"
        :key="chip"
        class="chip"
        data-testid="suggestion-chip"
        @click="topicTitle = chip"
      >
        {{ chip }}
      </button>
    </div>

    <p v-if="store.error" class="inline-error">{{ store.error }}</p>

    <div class="screen-footer">
      <button
        class="btn-primary"
        data-testid="submit-btn"
        :disabled="!topicTitle.trim() || store.loading"
        @click="onSubmit"
      >
        {{ store.loading ? 'Starting…' : 'Start learning →' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAppStore } from '../store/app'

const store = useAppStore()
const topicTitle = ref('')

const SUGGESTIONS = ['Roman Empire', 'ML fundamentals', 'Stoicism', 'Sleep science']

async function onSubmit() {
  const title = topicTitle.value.trim()
  if (!title) return
  await store.submitOnboarding(title)
}
</script>

<style scoped>
.screen-header { text-align: center; margin-bottom: 24px; }

.topic-input {
  width: 100%;
  padding: 14px 16px;
  font-size: 16px;
  border: 1.5px solid var(--tg-theme-secondary-bg-color, #e0e0e0);
  border-radius: 10px;
  background: var(--tg-theme-secondary-bg-color, #f9f9f9);
  color: var(--tg-theme-text-color, #000);
  outline: none;
  margin-bottom: 16px;
}

.topic-input:focus {
  border-color: var(--tg-theme-button-color, #0088cc);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.chip {
  background: var(--tg-theme-secondary-bg-color, #f0f0f0);
  color: var(--tg-theme-text-color, #000);
  border: none;
  border-radius: 16px;
  padding: 7px 14px;
  font-size: 13px;
  cursor: pointer;
}

.screen-footer {
  margin-top: auto;
  display: flex;
  justify-content: center;
}
</style>
