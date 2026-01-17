import { KeyboardControls, useGLTF, useTexture } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { useTranslation } from 'react-i18next'
import { FC, PropsWithChildren, useEffect } from 'react'

import { getTexturePath, PlayerSkins, useGameStore } from '@features/game'
import { JoystickController } from '@shared/lib/mobile-control/joystick'
import ButtonController from '@shared/lib/mobile-control/button'
import { useDeviceDetection } from '@shared/lib/device'
import { DevTools } from '@shared/lib/devtools'
import { useObserveTabFocus } from '@shared/lib/tab-focus'
import '../i18n'

const AppLayout: FC<PropsWithChildren> = ({ children }) => {
  const device = useDeviceDetection()
  const { t } = useTranslation()

  const { started } = useGameStore()

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

  useEffect(() => {
    const handleBlur = () => {
      window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowLeft' }))
      window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowRight' }))
      window.dispatchEvent(new KeyboardEvent('keyup', { code: 'Space' }))
    }

    window.addEventListener('blur', handleBlur)

    return () => {
      window.removeEventListener('blur', handleBlur)
    }
  }, [])

  useObserveTabFocus()

  return (
    <div className='h-full relative'>
      <Canvas>
        <KeyboardControls
          map={[
            { name: 'left', keys: ['ArrowLeft'] },
            { name: 'right', keys: ['ArrowRight'] },
            { name: 'jump', keys: ['Space'] },
          ]}>
          <Physics gravity={[0, -9.8, 0]} debug timeStep={1 / 60}>
            {children}
          </Physics>
        </KeyboardControls>
      </Canvas>
      {process.env.NODE_ENV === 'development' && <DevTools />}
      {device !== 'desktop' && started && (
        <>
          <JoystickController onLeft={handleLeft} onRight={handleRight} onReset={handleReset} />
          <ButtonController
            className='absolute right-8 bottom-8'
            onMouseDown={handlePressButton}
            onMouseUp={handleUnpressButton}
            onTouchStart={handlePressButton}
            onTouchEnd={handleUnpressButton}>
            {t('jump_text')}
          </ButtonController>
        </>
      )}
    </div>
  )
}

useGLTF.preload('models/compressed_grass-map.glb')
useGLTF.preload('models/grass-walls.glb')
useTexture.preload(getTexturePath(PlayerSkins.HERBIVORE))
useTexture.preload(getTexturePath(PlayerSkins.PREDATOR))

export default AppLayout
