import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api-dni': {
        target: 'https://api.apis.net.pe',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-dni/, ''),
      },
    },
  },
})
