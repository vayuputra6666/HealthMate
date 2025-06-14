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
      "5aae5467-73c4-4f8d-a82b-84fe38a15d08-00-2bdrx8yvtrolc.janeway.replit.dev"
    ]
  }
})