import { SettingsIcon } from '@shared/uikit/icons'
import { usePause } from '../../model/use-pause'

export const PauseButton = () => {
  const pauseGame = usePause()

  return <SettingsIcon onClick={pauseGame} />
}
