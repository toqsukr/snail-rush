import { animated } from '@react-spring/three'
import { PerspectiveCamera, Preload } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { createContext, FC, PropsWithChildren } from 'react'
import { MainSceneContextType } from './MainScene.type'
import { useMainScene } from './useMainScene'

export const mainSceneContext = createContext<MainSceneContextType | undefined>(undefined)

const MainScene: FC<PropsWithChildren> = ({ children }) => {
  const { spring, handleStart, updateCameraPosition } = useMainScene()

  return (
    <mainSceneContext.Provider value={{ handleStart, updateCameraPosition }}>
      <Preload all />
      <Perf position='top-left' />
      <ambientLight position={[5, 1, 0]} intensity={1} />
      <animated.group position={spring.position} rotation={spring.rotation as any}>
        <PerspectiveCamera makeDefault />
      </animated.group>
      {children}
    </mainSceneContext.Provider>
  )
}

export default MainScene
