<!-- src/components/ScreenWakeTime.vue -->
<template>
  <div class="screen">
    <div class="screen-header">
      <p class="step-label">Step 1 of 3</p>
      <h2 class="screen-title">When do you wake up?</h2>
    </div>

    <div class="stepper-area">
      <button class="stepper-btn" data-testid="step-down" @click="stepDown">−</button>

      <div v-if="!editing" class="time-display" data-testid="time-display" @click="startEditing">
        {{ store.draft.wakeTime }}
      </div>
      <input
        v-else
        ref="inputRef"
        class="time-input"
        data-testid="time-input"
        type="text"
        :value="rawInput"
        @input="rawInput = ($event.target as HTMLInputElement).value"
        @blur="commitEdit"
        @keydown.enter="commitEdit"
      />

      <button class="stepper-btn" data-testid="step-up" @click="stepUp">+</button>
    </div>

    <p class="tap-hint">Tap the time to type</p>

    <p v-if="store.error" class="inline-error">{{ store.error }}</p>

    <div class="screen-footer">
      <button class="btn-primary" data-testid="next-btn" @click="onNext">
        {{ store.editContext === 'wake-time-edit' ? 'Save' : 'Next →' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useAppStore } from '../store/app'
import { stepWakeTime, parseWakeTime } from '../composables/useWakeTime'

const store = useAppStore()

const editing = ref(false)
const rawInput = ref(store.draft.wakeTime)
const inputRef = ref<HTMLInputElement | null>(null)

function stepDown() {
  store.setWakeTimeDraft(stepWakeTime(store.draft.wakeTime, -30))
}

function stepUp() {
  store.setWakeTimeDraft(stepWakeTime(store.draft.wakeTime, 30))
}

async function startEditing() {
  editing.value = true
  rawInput.value = store.draft.wakeTime
  await nextTick()
  inputRef.value?.focus()
  inputRef.value?.select()
}

function commitEdit() {
  const parsed = parseWakeTime(rawInput.value)
  if (parsed) {
    store.setWakeTimeDraft(parsed)
  }
  // On invalid input, revert silently — draft stays unchanged
  editing.value = false
}

function onNext() {
  store.advanceFromWakeTime()
}
</script>

<style scoped>
.screen-header { text-align: center; margin-bottom: 40px; }

.stepper-area {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-bottom: 12px;
}

.stepper-btn {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: none;
  background: var(--tg-theme-secondary-bg-color, #f0f0f0);
  color: var(--tg-theme-text-color, #000);
  font-size: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.time-display {
  font-size: 56px;
  font-weight: 700;
  letter-spacing: -1px;
  border-bottom: 2px dashed var(--tg-theme-button-color, #0088cc);
  padding-bottom: 2px;
  min-width: 140px;
  text-align: center;
  cursor: pointer;
}

.time-input {
  font-size: 56px;
  font-weight: 700;
  letter-spacing: -1px;
  border: none;
  border-bottom: 2px solid var(--tg-theme-button-color, #0088cc);
  background: transparent;
  color: var(--tg-theme-text-color, #000);
  width: 160px;
  text-align: center;
  outline: none;
}

.tap-hint {
  text-align: center;
  font-size: 13px;
  color: var(--tg-theme-button-color, #0088cc);
  margin-bottom: 32px;
}

.screen-footer {
  margin-top: auto;
  padding-top: 24px;
  display: flex;
  justify-content: center;
}
</style>
