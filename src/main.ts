// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// Telegram WebApp types
declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready(): void
        expand(): void
        initData: string
        themeParams: Record<string, string>
      }
    }
  }
}

window.Telegram?.WebApp?.ready()
window.Telegram?.WebApp?.expand()

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
