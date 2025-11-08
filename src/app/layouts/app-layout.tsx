import { getTexturePath, PlayerSkins } from '@pages/home/model/status'
import { KeyboardControls, useGLTF, useTexture } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { FC, PropsWithChildren } from 'react'
import { JoystickController } from '@shared/lib/mobile-control/joystick'
import '../i18n'
import ButtonController from '@shared/lib/mobile-control/button'
import { useGameStore } from '@pages/home/model/store'

const AppLayout: FC<PropsWithChildren> = ({ children }) => {
  const started = useGameStore(s => s.started)
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

  const handleLeft = () => {
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' }))
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
  }

  const handleRight = () => {
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' }))
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
  }

  const handleReset = () => {
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' }))
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' }))
  }

  const handlePressButton = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Space' }))
  }

  const handleUnpressButton = () => {
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Space' }))
  }

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
      {started && (
        <>
          <JoystickController onLeft={handleLeft} onRight={handleRight} onReset={handleReset} />
          <ButtonController
            className='absolute right-8 bottom-8'
            onMouseDown={handlePressButton}
            onMouseUp={handleUnpressButton}
            onTouchStart={handlePressButton}
            onTouchEnd={handleUnpressButton}>
            JUMP
          </ButtonController>
        </>
      )}
    </div>
  )
}

useGLTF.preload('models/grass-map.glb')
useGLTF.preload('models/grass-walls.glb')
useTexture.preload(getTexturePath(PlayerSkins.HERBIVORE))
useTexture.preload(getTexturePath(PlayerSkins.PREDATOR))

export default AppLayout
