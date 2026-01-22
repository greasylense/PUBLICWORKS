import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Use relative paths so it works from any location
  base: './',
  build: {
    // Output directly to the projects folder
    outDir: '../../projects/rarity-engine',
    emptyOutDir: true,
  },
})
