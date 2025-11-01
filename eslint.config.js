import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Для ES modules нужно получить __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default tseslint.config(
  { ignores: ['dist', 'coverage'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': 'error',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        alias: {
          map: [
            ['@app', path.resolve(__dirname, './src/app')],
            ['@pages', path.resolve(__dirname, './src/pages')],
            ['@widgets', path.resolve(__dirname, './src/widgets')],
            ['@features', path.resolve(__dirname, './src/features')],
            ['@entities', path.resolve(__dirname, './src/entities')],
            ['@shared', path.resolve(__dirname, './src/shared')],
          ],
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        },
      },
    },
  }
)
