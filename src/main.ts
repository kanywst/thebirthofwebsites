import { createApp } from "vue"
import { createI18n } from "vue-i18n"
import App from "./App.vue"
import { type Locale, type MessageSchema, messages } from "./i18n"

const i18n = createI18n<[MessageSchema], Locale>({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages,
})

const app = createApp(App)
app.use(i18n)
app.mount("#app")
