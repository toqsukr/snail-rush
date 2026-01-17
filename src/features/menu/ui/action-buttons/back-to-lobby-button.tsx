import { useTranslation } from 'react-i18next'
import Button from '@shared/uikit/button/Button'
import { useBackToLobby } from '../../model/use-back-to-lobby'

const BackToLobbyButton = () => {
  const backToLobby = useBackToLobby()
  const { t } = useTranslation()

  return <Button onClick={backToLobby}>{t('back_to_lobby_text')}</Button>
}

export default BackToLobbyButton
