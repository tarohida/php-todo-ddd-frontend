<template>
  <Navigation></Navigation>
  <ContentArea
      v-bind:backend-url="backendUrl"
  ></ContentArea>
</template>

<script>
import Navigation from './components/Navigation.vue';
import ContentArea from "./components/ContentArea.vue";

export default {
  name: "App",
  data: function() {
    return {
      backendUrl: import.meta.env.VITE_BACKEND_URL
    }
  },
  components: {
    ContentArea,
    Navigation,
  }
}
</script>

<style scoped>
</style>
