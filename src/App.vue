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
body {
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
  background-color: #FAFAFA;
  color: #000;
  margin: 0;
}

a {
  text-decoration: none;
  color: currentColor;
  border-bottom: 1px dotted currentColor;
  &:hover,
  &:focus {
    border-bottom: 1px solid currentColor;
  }
}
</style>
