<script>
import Header from "@/components/Header.vue"
import Birth from "@/components/Birth.vue"
import Footer from "@/components/Footer.vue"

export default{
  components: {
    Header,
    Birth,
    Footer,
  },
}
</script>

<template>
  <div>
    <Header />
    <Birth class="birth" />
    <Footer />
  </div>
</template>

<style>
:root {
  --bg-color: #ffffff;
  --text-color: #000000;
  --accent-color: #000000;
  --border-width: 2px;
  --border-radius: 8px;
  --shadow-offset: 4px;
  --font-main: 'Inter', sans-serif;
  --font-heading: 'Space Grotesk', sans-serif;
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
a:focus {
  border-bottom: 2px solid currentColor;
  background-color: var(--text-color);
  color: var(--bg-color);
}

button {
  font-family: var(--font-main);
}

* {
  box-sizing: border-box;
}
</style>
