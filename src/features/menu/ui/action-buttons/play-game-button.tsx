import Button from '@shared/uikit/button/Button'
import { usePlay } from '../../model/use-play'

const PlayGameButton = () => {
  const { playAction, disabled } = usePlay()

  return (
    <Button disabled={disabled} onClick={playAction}>
      PLAY
    </Button>
  )
}

export default PlayGameButton
