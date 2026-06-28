<script setup lang="ts">
import Birth from "@/components/Birth.vue"
import AppFooter from "@/components/Footer.vue"
import AppHeader from "@/components/Header.vue"
</script>

<template>
  <AppHeader />
  <Birth class="birth" />
  <AppFooter />
</template>

<style>
:root {
  color-scheme: light dark;
  --bg-color: light-dark(#ffffff, #0a0a0a);
  --text-color: light-dark(#000000, #f5f5f5);
  --muted-color: light-dark(#333333, #b8b8b8);
  --hover-bg: light-dark(#f0f0f0, #1a1a1a);
  --header-bg: light-dark(rgba(255, 255, 255, 0.85), rgba(10, 10, 10, 0.85));
  --flag-border: light-dark(#eeeeee, #2a2a2a);
  --logo-bg: light-dark(transparent, #ffffff);
  --ended-bg: light-dark(#fbf7f9, #221c20);
  --ended-badge-bg: light-dark(#ffe3ef, #4a2438);
  --ended-badge-text: light-dark(#8a3b63, #ffd9e8);
  --ended-badge-border: light-dark(#e58bb0, #b56c8c);
  --ended-badge-shadow: light-dark(#e58bb0, #00000055);
  --accent-color: var(--text-color);
  --border-width: 2px;
  --border-radius: 8px;
  --shadow-offset: 4px;
  --font-main: "Inter", sans-serif;
  --font-heading: "Space Grotesk", sans-serif;
}

body {
  font-family: var(--font-main);
  background-color: var(--bg-color);
  color: var(--text-color);
  margin: 0;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  margin-top: 0;
}

a {
  text-decoration: none;
  color: currentColor;
  border-bottom: 1px dotted currentColor;
  transition: all 0.2s ease;
}

a:hover,
a:focus-visible {
  border-bottom: 2px solid currentColor;
  background-color: var(--text-color);
  color: var(--bg-color);
}

button {
  font-family: var(--font-main);
}

:focus-visible {
  outline: 2px solid var(--text-color);
  outline-offset: 2px;
}

* {
  box-sizing: border-box;
}
</style>
