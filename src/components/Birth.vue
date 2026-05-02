<script setup lang="ts">
import { computed, ref } from "vue"
import { useI18n } from "vue-i18n"
import {
  items as allItems,
  countByTag,
  filterByTag,
  searchByKeyword,
  sortByDate,
} from "@/lib/items"

const TYPE_FILTERS = [
  "All",
  "SNS",
  "EC",
  "portal site",
  "IT",
  "porn",
  "hardware",
  "search engine",
  "blog",
  "video",
  "knowledge market",
  "service",
  "language",
  "CNCF",
  "Web3",
  "Infrastructure",
  "Game",
  "AI",
  "Security",
  "FinTech",
  "SaaS",
  "Communication",
  "Design",
  "Music",
  "Education",
  "OS",
  "tool",
  "Piracy",
  "Dark Web",
] as const

const NATIONALITY_FILTERS = [
  "日本",
  "アメリカ",
  "ドイツ",
  "アイルランド",
  "中国",
  "韓国",
  "カナダ",
  "ハンガリー",
  "オランダ",
  "フランス",
  "イギリス",
  "エストニア",
  "スウェーデン",
  "ロシア",
  "ウクライナ",
  "オーストラリア",
  "スイス",
  "フィンランド",
  "台湾",
  "シンガポール",
  "インドネシア",
  "アルゼンチン",
  "ケニア",
  "インド",
  "カザフスタン",
  "香港",
] as const

const ERA_FILTERS = ["令和", "平成", "昭和", "大正", "明治"] as const

const { locale } = useI18n()

const keyword = ref("")
const activeFilter = ref<string>("All")
const publicPath = import.meta.env.BASE_URL

const sortedItems = sortByDate(allItems)

const filteredItems = computed(() => {
  const tagged = filterByTag(sortedItems, activeFilter.value)
  return searchByKeyword(tagged, keyword.value)
})

function selectFilter(filter: string) {
  activeFilter.value = filter
}

function count(tag: string): number {
  return countByTag(allItems, tag)
}
</script>

<template>
  <main class="main-wrapper">
    <div class="search-container">
      <input
        v-model="keyword"
        type="search"
        :placeholder="$t('search.placeholder')"
        :aria-label="$t('search.placeholder')"
        class="search-input"
      >
    </div>

    <section class="filters-container" :aria-label="$t('filters.label.category')">
      <div class="filter-group">
        <h2 class="filter-label">{{ $t("filters.label.category") }}</h2>
        <div class="filter-scroll" role="group">
          <button
            v-for="filter in TYPE_FILTERS"
            :key="filter"
            type="button"
            :aria-pressed="activeFilter === filter"
            :class="['filter-chip', { active: activeFilter === filter }]"
            @click="selectFilter(filter)"
          >
            {{ $t(`filters.types.${filter}`) }}
            <span class="count">{{ count(filter) }}</span>
          </button>
        </div>
      </div>

      <div class="filter-group">
        <h2 class="filter-label">{{ $t("filters.label.nationality") }}</h2>
        <div class="filter-scroll" role="group">
          <button
            v-for="filter in NATIONALITY_FILTERS"
            :key="filter"
            type="button"
            :aria-pressed="activeFilter === filter"
            :class="['filter-chip', { active: activeFilter === filter }]"
            @click="selectFilter(filter)"
          >
            {{ $t(`filters.nationalities.${filter}`) }}
            <span class="count">{{ count(filter) }}</span>
          </button>
        </div>
      </div>

      <div class="filter-group">
        <h2 class="filter-label">{{ $t("filters.label.era") }}</h2>
        <div class="filter-scroll" role="group">
          <button
            v-for="filter in ERA_FILTERS"
            :key="filter"
            type="button"
            :aria-pressed="activeFilter === filter"
            :class="['filter-chip', { active: activeFilter === filter }]"
            @click="selectFilter(filter)"
          >
            {{ $t(`filters.eras.${filter}`) }}
            <span class="count">{{ count(filter) }}</span>
          </button>
        </div>
      </div>
    </section>

    <section class="grid-container" aria-label="Timeline">
      <article v-for="item in filteredItems" :key="item.name" class="card">
        <header class="card-header">
          <span class="date">{{ item.date }}</span>
          <img
            :src="`${publicPath}flag/${item.nationality}.png`"
            class="flag"
            :alt="item.nationality"
          >
        </header>
        <div class="card-body">
          <div class="logo-container">
            <img :src="`${publicPath}${item.img}`" :alt="item.name" class="logo">
          </div>
          <h3 class="name">{{ item.name }}</h3>
          <p class="desc">
            {{ locale === "en" && item.description_en ? item.description_en : item.description }}
          </p>
        </div>
      </article>
    </section>
  </main>
</template>

<style scoped>
.main-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.search-container {
  margin-bottom: 2rem;
  text-align: center;
}

.search-input {
  width: 100%;
  max-width: 600px;
  padding: 1rem 1.5rem;
  font-size: 1.2rem;
  font-family: var(--font-main);
  background-color: var(--bg-color);
  color: var(--text-color);
  border: var(--border-width) solid var(--text-color);
  border-radius: 999px;
  outline: none;
  transition: all 0.2s ease;
}

.search-input:focus-visible {
  box-shadow: 4px 4px 0px var(--text-color);
  transform: translate(-2px, -2px);
}

.filters-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.6;
  margin: 0;
}

.filter-scroll {
  display: flex;
  gap: 0.8rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  scrollbar-width: thin;
}

.filter-scroll::-webkit-scrollbar {
  height: 4px;
}

.filter-scroll::-webkit-scrollbar-thumb {
  background-color: var(--text-color);
  border-radius: 4px;
}

.filter-chip {
  flex: 0 0 auto;
  background: transparent;
  color: var(--text-color);
  border: var(--border-width) solid var(--text-color);
  border-radius: var(--border-radius);
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.filter-chip:hover {
  background-color: var(--hover-bg);
}

.filter-chip.active {
  background-color: var(--text-color);
  color: var(--bg-color);
  box-shadow: 2px 2px 0px var(--text-color);
}

.filter-chip .count {
  font-size: 0.8em;
  margin-left: 4px;
  opacity: 0.8;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.card {
  border: var(--border-width) solid var(--text-color);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  background: var(--bg-color);
  box-shadow: var(--shadow-offset) var(--shadow-offset) 0px var(--text-color);
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px var(--text-color);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-family: var(--font-heading);
  font-size: 0.9rem;
  font-weight: bold;
}

.flag {
  height: 1.2rem;
  width: auto;
  border: 1px solid var(--flag-border);
}

.logo-container {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.logo {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
}

.name {
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
  text-align: center;
}

.desc {
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--muted-color);
  flex-grow: 1;
}
</style>
