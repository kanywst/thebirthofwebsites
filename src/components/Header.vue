<script setup lang="ts">
import { useI18n } from "vue-i18n"
import type { Locale } from "@/i18n"

const { locale } = useI18n<{ message: Record<string, unknown> }, Locale>()

function toggleLanguage() {
  locale.value = locale.value === "ja" ? "en" : "ja"
}
</script>

<template>
  <header class="site-header">
    <div class="header-inner">
      <div class="brand">
        <h1>{{ $t("header.title") }}</h1>
        <p class="subtitle">{{ $t("header.description") }}</p>
      </div>
      <div class="controls">
        <button
          type="button"
          class="lang-btn"
          :aria-label="locale === 'ja' ? 'Switch to English' : '日本語に切り替え'"
          @click="toggleLanguage"
        >
          <span :class="{ active: locale === 'en' }">EN</span>
          <span class="divider">/</span>
          <span :class="{ active: locale === 'ja' }">JP</span>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: var(--header-bg);
  backdrop-filter: blur(10px);
  border-bottom: var(--border-width) solid var(--text-color);
  padding: 1rem 0;
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.brand h1 {
  font-size: 1.8rem;
  margin-bottom: 0.2rem;
  letter-spacing: -0.02em;
}

.subtitle {
  font-size: 0.9rem;
  opacity: 0.7;
  margin: 0;
}

.lang-btn {
  background: transparent;
  color: var(--text-color);
  border: var(--border-width) solid var(--text-color);
  border-radius: 999px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.lang-btn:hover {
  background-color: var(--text-color);
  color: var(--bg-color);
}

.lang-btn span {
  opacity: 0.5;
}

.lang-btn span.active {
  opacity: 1;
}

.lang-btn .divider {
  opacity: 0.3;
}

@media (max-width: 600px) {
  .header-inner {
    flex-direction: column;
    text-align: center;
  }
  .lang-btn {
    margin-top: 0.5rem;
  }
}
</style>
