import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: null, // We will manually add registration in index.html as requested
      manifest: {
        name: 'BOS Invoices',
        short_name: 'BOS Admin',
        theme_color: '#111110',
        background_color: '#F4F3EE',
        display: 'standalone',
        icons: [
          {
            src: '/vite.svg', // Placeholder icon
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: '/vite.svg', // Placeholder icon
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
})
