import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
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
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      include: ['src/**'],
      exclude: [
        '..vitest-utils/**',
        '**/deprecated/**',
        '**/coverage/**',
        '**/stories.tsx',

        '**/app.tsx',
        '**/routes.tsx',
        '**/test-utils.tsx',

        '**/index.ts',
        '**/constants.ts',
        '**/types.ts',

        '**/slice.ts',
        '**/selectors.ts',
        '**/store.ts',
        '**/thunks.ts',
        '**/reducer.ts',

        '**/communications.ts',
        '**/communication.ts',
        '**/get-url-param.ts',
        '**/useAppDispatch.ts',
        '**/useAppSelector.ts',
      ],
    },
  },
})
