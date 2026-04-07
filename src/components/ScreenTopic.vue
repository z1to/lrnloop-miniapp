<!-- src/components/ScreenTopic.vue -->
<template>
  <div class="screen">
    <div class="screen-header">
      <p class="step-label">Step 3 of 3</p>
      <h2 class="screen-title">What do you want to learn?</h2>
    </div>

    <div class="input-wrapper">
      <input
        v-model="topicTitle"
        class="topic-input"
        data-testid="topic-input"
        type="text"
        placeholder="e.g. stoic philosophy"
        maxlength="200"
        autocomplete="off"
        @keydown.enter="onSubmit"
        @keydown.escape="closeSuggestions"
        @focus="showSuggestions = true"
        @blur="onBlur"
      />

      <div v-if="showSuggestions && topicTitle.trim()" class="dropdown">
        <template v-if="suggestions.length > 0">
          <button
            v-for="suggestion in suggestions"
            :key="suggestion"
            class="dropdown-item"
            data-testid="suggestion-item"
            @mousedown.prevent="selectSuggestion(suggestion)"
          >
            {{ suggestion }}
          </button>
        </template>
        <div v-else class="dropdown-empty">
          No suggestions — just type your topic and continue
        </div>
      </div>
    </div>

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
import { ref, computed } from 'vue'
import { useAppStore } from '../store/app'
import { searchTopics } from '../composables/useTopicSuggestions'

const store = useAppStore()
const topicTitle = ref('')
const showSuggestions = ref(false)

const SUGGESTIONS = ['Roman Empire', 'ML fundamentals', 'Stoicism', 'Sleep science']

const suggestions = computed(() => searchTopics(topicTitle.value))

function selectSuggestion(topic: string) {
  topicTitle.value = topic
  showSuggestions.value = false
}

function closeSuggestions() {
  showSuggestions.value = false
}

function onBlur() {
  // Delay so mousedown on dropdown items fires first
  setTimeout(() => { showSuggestions.value = false }, 150)
}

async function onSubmit() {
  const title = topicTitle.value.trim()
  if (!title) return
  showSuggestions.value = false
  await store.submitOnboarding(title)
}
</script>

<style scoped>
.screen-header { text-align: center; margin-bottom: 24px; }

.input-wrapper {
  position: relative;
  width: 100%;
  margin-bottom: 16px;
}

.topic-input {
  width: 100%;
  padding: 14px 16px;
  font-size: 16px;
  border: 1.5px solid var(--tg-theme-secondary-bg-color, #e0e0e0);
  border-radius: 10px;
  background: var(--tg-theme-secondary-bg-color, #f9f9f9);
  color: var(--tg-theme-text-color, #000);
  outline: none;
  box-sizing: border-box;
}

.topic-input:focus {
  border-color: var(--tg-theme-button-color, #0088cc);
}

.dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: var(--tg-theme-bg-color, #fff);
  border: 1.5px solid var(--tg-theme-button-color, #0088cc);
  border-radius: 10px;
  overflow: hidden;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 12px 16px;
  text-align: left;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--tg-theme-secondary-bg-color, #f0f0f0);
  color: var(--tg-theme-text-color, #000);
  font-size: 15px;
  cursor: pointer;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background: color-mix(in srgb, var(--tg-theme-button-color, #0088cc) 10%, transparent);
}

.dropdown-empty {
  padding: 12px 16px;
  font-size: 14px;
  color: var(--tg-theme-hint-color, #999);
  font-style: italic;
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
