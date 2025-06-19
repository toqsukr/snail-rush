import { Logflow } from '@features/logflow'
import { getTexturePath, PlayerSkins } from '@pages/home/lib/status'
import { useGameStore } from '@pages/home/model/store'
import { KeyboardControls, useGLTF, useTexture } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { Perf } from 'r3f-perf'
import { FC, PropsWithChildren, useState } from 'react'
import { TbRefresh } from 'react-icons/tb'
import '../i18n'

const AppLayout: FC<PropsWithChildren> = ({ children }) => {
  const started = useGameStore(s => s.started)
  const [leftKey, updateLeftKey] = useState('ArrowLeft')
  const [rightKey, updateRightKey] = useState('ArrowRight')

  const handleChangeControl = () => {
    if (leftKey === 'ArrowLeft') {
      updateLeftKey('KeyA')
      updateRightKey('KeyD')
    } else {
      updateLeftKey('ArrowLeft')
      updateRightKey('ArrowRight')
    }
  }

  const getControlImage = () => {
    if (leftKey === 'ArrowLeft') return '/images/arrows.png'

    return '/images/wasd.png'
  }

  return (
    <div className='h-full relative'>
      {started || <Logflow />}
      <aside className='absolute left-0 bottom-0 z-[1]'>
        <TbRefresh
          style={{ transform: 'translate(-50%, -50%)' }}
          onClick={handleChangeControl}
          className='absolute left-1/2 top-1/2 w-8 h-8 cursor-pointer'
        />
        <img src={getControlImage()} className='inline-block w-max h-max' />
      </aside>
      <Canvas>
        <KeyboardControls
          map={[
            { name: 'left', keys: [leftKey] },
            { name: 'right', keys: [rightKey] },
            { name: 'jump', keys: ['Space'] },
          ]}>
          {/* <OrbitControls /> */}
          <Perf position='top-left' />
          <Physics gravity={[0, -20, 0]} timeStep={1 / 60}>
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
