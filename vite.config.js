import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,  // expose ke jaringan lokal (0.0.0.0)
    port: 5173,
    proxy: {
      // Semua request /api/* dari frontend diteruskan ke backend NestJS
      '/api': {
        target: 'https://gizisnap-backend-production.up.railway.app',
        changeOrigin: true,
        secure: false,
      },
      // Proxy uploaded food images dari backend
      '/uploads': {
        target: 'https://gizisnap-backend-production.up.railway.app',
        changeOrigin: true,
        secure: false,
      },
    },
    allowedHosts: true,
  },
})

