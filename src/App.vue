<template>
  <Navigation></Navigation>
  <ContentArea
      :backend-url="backendUrl"
      :todo-api="todoApi"
  ></ContentArea>
</template>

<script>
import Navigation from './components/Navigation.vue';
import ContentArea from "./components/ContentArea.vue";
import { createTodoApi } from './api/todoApi.js'

export default {
  name: "App",
  data: function() {
    const backendUrl = (import.meta.env.VITE_BACKEND_URL ?? '').trim()
    return {
      backendUrl,
      todoApi: backendUrl ? createTodoApi({ baseUrl: backendUrl }) : null,
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
