import { useSnail } from './useSnail'

const Snail = () => {
  const { modelRef, model, triggerJump } = useSnail()

  return <primitive object={model.scene} ref={modelRef} onClick={triggerJump} />
}

export default Snail
