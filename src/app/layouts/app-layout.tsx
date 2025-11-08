import { getTexturePath, PlayerSkins } from '@pages/home/model/status'
import { KeyboardControls, useGLTF, useTexture } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { FC, PropsWithChildren } from 'react'
import '../i18n'

const AppLayout: FC<PropsWithChildren> = ({ children }) => {
  // const started = useGameStore(s => s.started)
  // const [leftKey, updateLeftKey] = useState('ArrowLeft')
  // const [rightKey, updateRightKey] = useState('ArrowRight')

  // const handleChangeControl = () => {
  //   if (leftKey === 'ArrowLeft') {
  //     updateLeftKey('KeyA')
  //     updateRightKey('KeyD')
  //   } else {
  //     updateLeftKey('ArrowLeft')
  //     updateRightKey('ArrowRight')
  //   }
  // }

  return (
    <div className='h-full relative'>
      {/* {started || <Logflow />} */}
      <Canvas>
        <KeyboardControls
          map={[
            { name: 'left', keys: ['ArrowLeft'] },
            { name: 'right', keys: ['ArrowRight'] },
            { name: 'jump', keys: ['Space'] },
          ]}>
          {/* <OrbitControls /> */}
          {/* <Perf position='top-left' /> */}
          <Physics gravity={[0, -15, 0]} debug timeStep='vary'>
            {children}
          </Physics>
        </KeyboardControls>
      </Canvas>
    </div>
  )
}

useGLTF.preload('models/grass-map.glb')
useGLTF.preload('models/grass-walls.glb')
useTexture.preload(getTexturePath(PlayerSkins.HERBIVORE))
useTexture.preload(getTexturePath(PlayerSkins.PREDATOR))

export default AppLayout
