import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Base path for serving from /projects/rarity-engine/
  base: '/projects/rarity-engine/',
  build: {
    // Output directly to the projects folder
    outDir: '../../projects/rarity-engine',
    emptyOutDir: true,
  },
})
