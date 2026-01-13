import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'aboutus.html'),
        chatbot: resolve(__dirname, 'chatbot.html'),
        contact: resolve(__dirname, 'contactus.html'),
        livogue: resolve(__dirname, 'Livogue.html'),
        tech: resolve(__dirname, 'tech.html'),
        wellfit: resolve(__dirname, 'wellfit.html'),
      },
    },
  },
})