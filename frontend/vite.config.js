import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,           // écoute sur 0.0.0.0 (pas juste localhost)
    port: 3000,
    watch: {
      usePolling: true,   // active le polling au lieu d'inotify
      interval: 100       // optionnel, fréquence du polling en ms
    }
  }
})