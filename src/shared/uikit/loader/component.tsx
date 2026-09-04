import { useTranslation } from 'react-i18next'

/**
 * Placeholder shown while a screen is still on the way.
 */
export const Loader = () => {
  const { t } = useTranslation()
  return <div>{t('loading_text')}</div>
}
