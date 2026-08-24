import { useTranslation } from 'react-i18next'
import Button from '@shared/uikit/button/Button'
import FailureScreen from './failure-screen'

const ErrorScreen = () => {
  const { t } = useTranslation()

  const handleReloadClick = () => window.location.reload()

  return (
    <FailureScreen
      title={t('error_title_text')}
      hint={t('error_hint_text')}
      action={<Button onClick={handleReloadClick}>{t('reload_text')}</Button>}
    />
  )
}

export default ErrorScreen
