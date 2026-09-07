import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'

const packageJson = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))

export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? '/',
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/@firebase/auth')) return 'firebase-auth'
          if (id.includes('node_modules/@firebase/firestore')) return 'firebase-firestore'
          if (id.includes('node_modules/@firebase/storage')) return 'firebase-storage'
          if (id.includes('/firebase/') || id.includes('node_modules/@firebase')) return 'firebase-core'
          if (id.includes('node_modules/lucide-react')) return 'icons'
          if (id.includes('node_modules/react') || id.includes('node_modules/scheduler')) return 'react'
        },
      },
    },
  },
  test: { environment: 'jsdom' },
})
