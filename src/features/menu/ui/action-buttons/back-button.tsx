import Button from '@shared/uikit/button/Button'
import { useBack } from '../../model/use-back'

const BackButton = () => {
  const goBack = useBack()

  return <Button onClick={goBack}>BACK</Button>
}

export default BackButton
