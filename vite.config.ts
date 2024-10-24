import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'src/components'),
      images: path.resolve(__dirname, 'src/images'),
      modules: path.resolve(__dirname, 'src/modules'),
    },
  },
})
