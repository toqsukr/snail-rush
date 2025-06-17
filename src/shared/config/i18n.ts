const locales = import.meta.glob(
  [
    '/src/app/**/lib/locales/i18n-*.json',
    '/src/pages/**/lib/locales/i18n-*.json',
    '/src/widgets/**/lib/locales/i18n-*.json',
    '/src/features/**/lib/locales/i18n-*.json',
    '/src/entities/**/lib/locales/i18n-*.json',
  ],
  { eager: true }
)

export const resources = Object.entries(locales).reduce((acc, [path, module]) => {
  const [, lang] = path.match(/i18n-(.+?)\.json/) || []
  if (!acc[lang]) acc[lang] = { translation: {} }
  Object.assign(acc[lang].translation, (module as any).default)
  return acc
}, {} as Record<string, { translation: Record<string, any> }>)
