<script>
export default {
  methods: {
    toggleLanguage() {
      this.$i18n.locale = this.$i18n.locale === 'ja' ? 'en' : 'ja';
    }
  }
}
</script>

<template>
  <header>
    <div class="lang-switch">
      <button @click="toggleLanguage">
        {{ $i18n.locale === 'ja' ? 'English' : '日本語' }}
      </button>
    </div>
    <h1>{{ $t('header.title') }}</h1>
    <p>{{ $t('header.description') }}</p>
  </header>
</template>

<style>
header {
  text-align: center;
  position: relative;
}
.lang-switch {
  position: absolute;
  top: 10px;
  right: 10px;
}
.lang-switch button {
  background: transparent;
  border: 1px solid #ccc;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
}
</style>
