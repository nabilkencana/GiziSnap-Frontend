import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    proxy: {
      // Semua request /api/* dari frontend diteruskan ke backend NestJS
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      // Proxy uploaded food images dari backend
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
    allowedHosts: true,
  },
})

