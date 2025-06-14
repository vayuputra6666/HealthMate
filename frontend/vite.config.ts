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
      "57ee08c7-fdfa-46c3-9fc2-6f7087b11288-00-2vcomswrnsxtt.riker.replit.dev"
    ]
  }
})