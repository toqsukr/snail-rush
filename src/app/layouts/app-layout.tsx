import { Logflow } from '@features/logflow'
import { getTexturePath, PlayerSkins } from '@pages/home/lib/status'
import { useGameStore } from '@pages/home/model/store'
import { useGLTF, useTexture } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { Perf } from 'r3f-perf'
import { FC, PropsWithChildren } from 'react'

const AppLayout: FC<PropsWithChildren> = ({ children }) => {
  const started = useGameStore(s => s.started)
  return (
    <div className='h-full relative'>
      {started || <Logflow />}
      <Canvas>
        {/* <OrbitControls/> */}
        <Perf position='top-left' />
        <Physics debug gravity={[0, -20, 0]} timeStep={1 / 60}>
          {children}
        </Physics>
      </Canvas>
    </div>
  )
}

useGLTF.preload('models/grass-map.glb')
useGLTF.preload('models/grass-walls.glb')
useTexture.preload(getTexturePath(PlayerSkins.HERBIVORE))
useTexture.preload(getTexturePath(PlayerSkins.PREDATOR))

export default AppLayout
