import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Broader browser support — iOS Safari 14+, older Chrome/Firefox/Edge
    target: ['es2020', 'safari14', 'chrome87', 'firefox78', 'edge88'],
    cssTarget: ['safari14', 'chrome87', 'firefox78', 'edge88'],
  },
})
