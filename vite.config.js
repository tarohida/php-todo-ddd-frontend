import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'node',
  },
  server: {
    host: '0.0.0.0',
    port: 8080,
    strictPort: true,
  },
})
