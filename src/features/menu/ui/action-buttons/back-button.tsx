import { useMainMenuDeps } from '@features/menu/deps'
import Button from '@shared/uikit/button/Button'
import { FC } from 'react'
import { useBack } from '../../model/use-back'

const BackButton: FC<
  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
> = props => {
  const goBack = useBack()
  const { onBackToMainMenu } = useMainMenuDeps()

  const onClick = () => {
    goBack()
    onBackToMainMenu()
  }

  return (
    <Button {...props} onClick={onClick}>
      BACK
    </Button>
  )
}

export default BackButton
