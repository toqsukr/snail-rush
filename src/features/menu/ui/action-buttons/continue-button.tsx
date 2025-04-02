import Button from '@shared/uikit/button/Button'
import { useContinue } from '../../model/use-continue'

const ContinueButton = () => {
  const continueGame = useContinue()

  return <Button onClick={continueGame}>CONTINUE</Button>
}

export default ContinueButton
