import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' — относительные пути: страница работает по любому адресу GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: './',
})
