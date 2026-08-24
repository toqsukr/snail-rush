import { useTranslation } from 'react-i18next'
import FailureScreen from './failure-screen'

const WebglScreen = () => {
  const { t } = useTranslation()

  return <FailureScreen title={t('webgl_title_text')} hint={t('webgl_hint_text')} />
}

export default WebglScreen
