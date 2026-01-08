import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import { messages } from './i18n'

const i18n = createI18n({
  legacy: false, // Vue 3 Composition API mode
  locale: 'en', // default locale
  fallbackLocale: 'en',
  messages
})

const app = createApp(App)
app.use(i18n)
app.mount('#app')