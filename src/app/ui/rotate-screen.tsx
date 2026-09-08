import { useTranslation } from 'react-i18next'
import FailureScreen from './failure-screen'

const ABOVE_SCENE_HTML = 16777272

const RotateScreen = () => {
  const { t } = useTranslation()

  return (
    <div className='fixed inset-0 bg-[#242424]' style={{ zIndex: ABOVE_SCENE_HTML }}>
      <FailureScreen title={t('rotate_title_text')} hint={t('rotate_hint_text')} />
    </div>
  )
}

export default RotateScreen
