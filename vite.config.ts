import react from '@vitejs/plugin-react-swc'
import path from 'path' // npm i --save-dev @types/node
import Unfonts from 'unplugin-fonts/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Unfonts({
      google: { families: ['Jersey 25'], preconnect: true },
    }),
  ],
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, './src/assets'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@modules': path.resolve(__dirname, './src/modules'),
      '@scenes': path.resolve(__dirname, './src/scenes'),
      '@objects': path.resolve(__dirname, './src/objects'),
      '@app': path.resolve(__dirname, './src/app'),
      '@widgets': path.resolve(__dirname, './src/widgets'),
      '@features': path.resolve(__dirname, './src/features'),
      '@entities': path.resolve(__dirname, './src/entities'),
      '@shared': path.resolve(__dirname, './src/shared'),
    },
  },
})
