<template>
  <header class="app-header">
    <nav class="app-header__inner" aria-label="メインナビゲーション">
      <NavigationTitle />
      <span class="app-header__context">今日を軽やかに整える</span>
    </nav>
  </header>
</template>
<script>
import NavigationTitle from './NavigationTitle.vue'
export default { name: 'Navigation', components: { NavigationTitle } }
</script>
<style scoped>
.app-header { border-bottom: 1px solid var(--color-border-subtle); background: color-mix(in srgb, var(--color-canvas) 88%, transparent); backdrop-filter: blur(18px); }
.app-header__inner { display: flex; width: min(100% - 2rem, var(--workspace-width)); min-height: 4.5rem; margin-inline: auto; align-items: center; justify-content: space-between; }
.app-header__context { color: var(--color-text-muted); font-size: .82rem; }
@media (max-width: 35rem) { .app-header__context { display: none; } }
</style>
