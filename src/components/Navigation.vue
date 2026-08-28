<style scoped>
.container {
  max-width: 960px;
}

.site-header {
  background-color: rgba(0, 0, 0, .85);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  backdrop-filter: saturate(180%) blur(20px);
}
.site-header a {
  color: #8e8e8e;
  transition: color .15s ease-in-out;
}
.site-header a:hover {
  color: #fff;
  text-decoration: none;
}

.flex-equal > * {
  flex: 1;
}
@media (min-width: 768px) {
  .flex-md-equal > * {
    flex: 1;
  }
}
</style>

<template>
  <header class="site-header sticky-top py-1">
    <nav class="container d-flex flex-column flex-md-row justify-content-between">
      <NavigationTitle></NavigationTitle>
      <NavigationProfileDropDownCaret></NavigationProfileDropDownCaret>
    </nav>
  </header>
</template>

<script>
import NavigationProfileDropDownCaret from "./NavigationProfileDropDownCaret.vue";
import NavigationTitle from './NavigationTitle.vue';
export default {
  name: 'Navigation',
  components: {
    NavigationProfileDropDownCaret,
    NavigationTitle
  }
}
</script>
