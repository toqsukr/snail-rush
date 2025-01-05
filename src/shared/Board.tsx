import Scene from '@modules/app/scene/Scene'
import { useAppState } from '@modules/gameplay/store'
import { animated, useSpring } from '@react-spring/web'
import { Preload } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Perf } from 'r3f-perf'
import css from './Board.module.scss'

const Board = () => {
  const { started } = useAppState()

  const props = useSpring({
    scale: started ? 1 : 0,
  })

  return (
    <>
      <Canvas>
        <Perf position='top-left' />
        <Scene />
        <Preload all />
      </Canvas>
      <animated.div style={props} className={css.settings} />
    </>
  )
}

export default Board
