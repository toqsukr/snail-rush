import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Routes } from '@shared/model/routes'
import { Button } from '@shared/uikit/button'
import FailureScreen from './failure-screen'

const NotFoundScreen = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleToHomePageClick = () => navigate(Routes.HOME)

  return (
    <FailureScreen
      title={t('not_found_title_text')}
      hint={t('not_found_hint_text')}
      action={<Button onClick={handleToHomePageClick}>{t('to_home_text')}</Button>}
    />
  )
}

export default NotFoundScreen
