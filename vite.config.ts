import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    watch: {
      usePolling: true
    },
    proxy: {
      '/api/thegamesdb': {
        target: 'https://api.thegamesdb.net/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/thegamesdb/, ''),
      },
    },
  }
})
