import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@shared/uikit/button/Button'
import { useMainMenuDeps } from '../../../menu/deps'
import { useBack } from '../../model/use-back'

const BackButton: FC<
  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
> = props => {
  const goBack = useBack()
  const { onBackToMainMenu } = useMainMenuDeps()
  const { t } = useTranslation()

  const onClick = () => {
    goBack()
    onBackToMainMenu()
  }

  return (
    <Button {...props} onClick={onClick}>
      {t('back_text')}
    </Button>
  )
}

export default BackButton
