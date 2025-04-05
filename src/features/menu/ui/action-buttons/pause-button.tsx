import { useMenu } from '@features/menu/model/store'
import { animated, useSpring } from '@react-spring/web'
import { SettingsIcon } from '@shared/uikit/icons'
import { FC, HTMLAttributes } from 'react'
import { createPortal } from 'react-dom'
import { usePause } from '../../model/use-pause'

const AnimatedPauseIcon: FC<HTMLAttributes<HTMLDivElement>> = props => {
  const { visibility } = useMenu()

  const pauseIconProp = useSpring({
    scale: visibility ? 0 : 1,
  })

  return (
    <animated.div {...props} style={pauseIconProp} className='fixed top-0 right-0 m-4'>
      <SettingsIcon />
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
