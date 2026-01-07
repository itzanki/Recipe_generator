
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      include: ['**/*.js', '**/*.jsx'] // Process both .js and .jsx as JSX
    }) ],

  server: {
    port: 3000,
    host: true
  },
  css: {
    postcss: './postcss.config.js',
  }
})
