import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "../shared"),
    },
  },
  build: {
    rollupOptions: {
      external: ["drizzle-orm/pg-core", "drizzle-orm"]
    }
  },
  server: {
    port: 5173,
    host: "0.0.0.0",
    allowedHosts: [
      "51d76f11-192a-4da6-af5b-92acab03c729-00-38kybzaz22f7l.spock.replit.dev"
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})