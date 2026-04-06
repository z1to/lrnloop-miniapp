<!-- src/components/ScreenDashboard.vue -->
<template>
  <div class="screen">

    <!-- Topics section -->
    <p class="section-label">YOUR TOPICS ({{ store.topics.length }}/2)</p>

    <div class="topics-list">
      <div v-for="topic in store.topics" :key="topic.id" class="topic-row">
        <span class="topic-title">{{ topic.title }}</span>
        <button
          class="remove-btn"
          data-testid="remove-btn"
          @click="store.deleteTopic(topic.id)"
        >
          Remove
        </button>
      </div>

      <!-- Add second topic slot -->
      <template v-if="store.topics.length < 2">
        <div
          v-if="!addingTopic"
          class="add-topic-slot"
          data-testid="add-topic-slot"
          @click="addingTopic = true"
        >
          + Add second topic
        </div>
        <div v-else class="add-topic-inline">
          <input
            ref="addInputRef"
            v-model="newTopicTitle"
            class="topic-add-input"
            data-testid="add-topic-input"
            type="text"
            placeholder="e.g. sleep science"
            maxlength="200"
            @keydown.enter="submitAddTopic"
            @keydown.escape="cancelAdd"
          />
          <button
            class="btn-primary btn--small"
            :disabled="!newTopicTitle.trim() || store.loading"
            @click="submitAddTopic"
          >
            Add
          </button>
          <button class="btn-ghost" @click="cancelAdd">Cancel</button>
        </div>
      </template>
    </div>

    <p v-if="store.error" class="inline-error">{{ store.error }}</p>

    <!-- Settings section -->
    <p class="section-label" style="margin-top: 32px">SETTINGS</p>

    <div class="settings-list">
      <div
        class="settings-row"
        data-testid="edit-waketime"
        @click="store.navigateToEditWakeTime()"
      >
        <span class="settings-label">Wake time</span>
        <span class="settings-value">{{ store.displayWakeTime }} ›</span>
      </div>
      <div
        class="settings-row"
        data-testid="edit-timezone"
        @click="store.navigateToEditTimezone()"
      >
        <span class="settings-label">Timezone</span>
        <span class="settings-value">{{ displayCity }} ›</span>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { useAppStore } from '../store/app'
import { getPrimaryCity } from '../composables/useTimezone'

const store = useAppStore()

const addingTopic = ref(false)
const newTopicTitle = ref('')
const addInputRef = ref<HTMLInputElement | null>(null)

const displayCity = computed(() =>
  store.user?.timezone ? getPrimaryCity(store.user.timezone) : ''
)

watch(addingTopic, async (val) => {
  if (val) {
    await nextTick()
    addInputRef.value?.focus()
  }
})

async function submitAddTopic() {
  const title = newTopicTitle.value.trim()
  if (!title) return
  await store.addTopic(title)
  if (!store.error) {
    newTopicTitle.value = ''
    addingTopic.value = false
  }
}

function cancelAdd() {
  newTopicTitle.value = ''
  addingTopic.value = false
  store.clearError()
}
</script>

<style scoped>
.topics-list { margin-bottom: 8px; }

.topic-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  background: var(--tg-theme-secondary-bg-color, #f9f9f9);
  border-radius: 10px;
  margin-bottom: 8px;
}

.topic-title { font-size: 15px; font-weight: 500; }

.remove-btn {
  background: none;
  border: none;
  color: #e44;
  font-size: 13px;
  cursor: pointer;
  padding: 4px 8px;
}

.add-topic-slot {
  border: 2px dashed var(--tg-theme-hint-color, #ccc);
  border-radius: 10px;
  padding: 14px;
  text-align: center;
  color: var(--tg-theme-hint-color, #999);
  font-size: 14px;
  cursor: pointer;
}

.add-topic-inline {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.topic-add-input {
  flex: 1;
  padding: 10px 14px;
  font-size: 15px;
  border: 1.5px solid var(--tg-theme-button-color, #0088cc);
  border-radius: 8px;
  background: transparent;
  color: var(--tg-theme-text-color, #000);
  outline: none;
  min-width: 0;
}

.btn--small { padding: 10px 16px; font-size: 14px; max-width: unset; width: auto; }

.btn-ghost {
  background: none;
  border: none;
  color: var(--tg-theme-hint-color, #888);
  font-size: 14px;
  cursor: pointer;
  padding: 10px 8px;
}

.settings-list {
  border-radius: 10px;
  overflow: hidden;
  background: var(--tg-theme-secondary-bg-color, #f9f9f9);
}

.settings-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  cursor: pointer;
  border-bottom: 1px solid var(--tg-theme-bg-color, #ececec);
}

.settings-row:last-child { border-bottom: none; }

.settings-label { font-size: 15px; color: var(--tg-theme-hint-color, #666); }
.settings-value { font-size: 15px; font-weight: 600; }
</style>
