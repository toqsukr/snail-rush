import { useGameMapDeps } from '../deps'

const FinishLine = () => {
  const { renderFinishLine } = useGameMapDeps()

  return renderFinishLine
}

export default FinishLine
