import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl =
    env.VITE_API_URL ?? 'https://api-solucionesgs.pizzerialalosmid.com.mx/'

  let apiHost = 'api-solucionesgs.pizzerialalosmid.com.mx'
  try {
    apiHost = new URL(apiUrl).hostname
  } catch {
    // fallback al host por defecto
  }

  const apiUrlPattern = new RegExp(
    `^https?:\\/\\/${escapeRegExp(apiHost)}(:\\d+)?\\/.*`,
    'i',
  )

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
        manifest: {
          name: 'Financiera Soluciones GS',
          short_name: 'Financiera GS',
          description: 'Sistema de créditos y cobranza',
          theme_color: '#0284c7',
          background_color: '#f5f1e6',
          display: 'standalone',
          lang: 'es',
          start_url: '/',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          navigateFallback: 'index.html',
          runtimeCaching: [
            {
              urlPattern: apiUrlPattern,
              handler: 'NetworkOnly',
            },
          ],
        },
      }),
    ],
  }
})
