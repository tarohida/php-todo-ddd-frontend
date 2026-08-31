<template>
  <a class="app-identity" href="/" aria-label="Todoホームへ移動">
    <span class="app-identity__mark" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="m6.5 12.5 3.25 3.25L17.8 7.7" /></svg></span>
    <span data-testid="app-title">Todoホーム</span>
  </a>
</template>
<style scoped>
.app-identity { display: inline-flex; align-items: center; gap: var(--space-3); color: var(--color-text-strong); font-size: 1rem; font-weight: 720; letter-spacing: -.01em; text-decoration: none; }
.app-identity__mark { display: grid; width: 2rem; height: 2rem; place-items: center; border-radius: .7rem; background: var(--color-accent); color: white; box-shadow: var(--shadow-soft); }
.app-identity__mark svg { width: 1.2rem; fill: none; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2.25; }
</style>
