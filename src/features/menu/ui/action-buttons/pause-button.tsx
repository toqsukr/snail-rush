import { createPortal } from 'react-dom'
import { FC, HTMLAttributes } from 'react'
import { animated, useSpring } from '@react-spring/web'
import { useMenu } from '@features/menu/model/store'
import { SettingsIcon } from '@shared/uikit/icons'
import { usePause } from '../../model/use-pause'

const AnimatedPauseIcon: FC<HTMLAttributes<HTMLDivElement>> = props => {
  const { visibility } = useMenu()

  const pauseIconProp = useSpring({
    scale: visibility ? 0 : 1,
  })

  return (
    <animated.div {...props} style={pauseIconProp} className='fixed top-0 right-0 m-4'>
      <button
        disabled={visibility}
        className='focus-visible:text-[var(--primary-color)] transition-colors'>
        <SettingsIcon />
      </button>
    </animated.div>
  )
}

export const PauseButton = () => {
  const pauseGame = usePause()

  const portalParentElement = document.getElementById('root')

  return (
    portalParentElement &&
    createPortal(<AnimatedPauseIcon onClick={pauseGame} />, portalParentElement)
  )
}
