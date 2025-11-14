import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import Unfonts from 'unplugin-fonts/vite'
import { VitePWA } from 'vite-plugin-pwa'
import basicSSL from '@vitejs/plugin-basic-ssl'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      basicSSL(),
      Unfonts({
        google: { families: ['Jersey 25', 'Roboto'], preconnect: true },
      }),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'Snail Rush',
          short_name: 'Snail Rush',
          start_url: '/',
          orientation: 'landscape',
          display: 'standalone',
          icons: [
            {
              src: 'windows11/Square44x44Logo.targetsize-256.png',
              sizes: '256x256',
            },
            {
              src: 'windows11/Square44x44Logo.altform-unplated_targetsize-256.png',
              sizes: '256x256',
            },
            {
              src: 'windows11/Square44x44Logo.altform-lightunplated_targetsize-256.png',
              sizes: '256x256',
            },
            {
              src: 'android/android-launchericon-512-512.png',
              sizes: '512x512',
            },
            {
              src: 'android/android-launchericon-192-192.png',
              sizes: '192x192',
            },
            {
              src: 'ios/192.png',
              sizes: '192x192',
            },
            {
              src: 'ios/512.png',
              sizes: '512x512',
            },
          ],
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
          runtimeCaching: [
            {
              urlPattern: ({ request }) =>
                request.destination === 'image' || request.destination === 'script',
              handler: 'CacheFirst',
              options: {
                cacheName: 'assets-cache',
                expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
              },
            },
            {
              urlPattern: /\/(models|textures)\//,
              handler: 'CacheFirst',
              options: {
                cacheName: 'threejs-assets',
                expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 },
              },
            },
          ],
        },
      }),
    ],
    server: {
      proxy: {
        // Для HTTP API
        '/api': {
          target: `http://localhost:${env.VITE_SERVER_PORT}`,
          changeOrigin: true,
          secure: false,
        },
        // Для WebSocket
        '/api/v1/gameplay/session': {
          target: `ws://localhost:${env.VITE_SERVER_PORT}`,
          changeOrigin: true,
          secure: false,
          ws: true,
        },
      },
    },
    resolve: {
      alias: {
        '@app': path.resolve(__dirname, './src/app'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@widgets': path.resolve(__dirname, './src/widgets'),
        '@features': path.resolve(__dirname, './src/features'),
        '@entities': path.resolve(__dirname, './src/entities'),
        '@shared': path.resolve(__dirname, './src/shared'),
      },
    },
  }
})
