import { useAppState } from '@modules/gameplay/store'
import { animated, useSpring } from '@react-spring/web'
import LoadingLayout from '@shared/loading-layout/LoadingLayout'
import Menu from '@shared/menu/Menu'
import cn from 'clsx'
import { useState } from 'react'
import css from './PauseMenu.module.scss'

const PauseMenu = () => {
  const { moveable, pause, onPauseGame, onResumeGame } = useAppState()
  const [visible, setVisible] = useState(false)

  const pauseIconProp = useSpring({
    scale: moveable ? 1 : 0,
  })

  const pauseMenuProp = useSpring({
    opacity: pause ? 1 : 0,
    onRest: () => {
      setVisible(pause)
    },
  })

  return (
    <>
      <animated.div onClick={onPauseGame} style={pauseIconProp} className={css.pause_icon} />
      <animated.div
        style={pauseMenuProp}
        className={cn(css.pause_menu, { [css.visible]: pause || visible })}>
        <LoadingLayout>
          <Menu>
            <Menu.Button onClick={onResumeGame}>CONTINUE</Menu.Button>
            <Menu.Button>EXIT</Menu.Button>
          </Menu>
        </LoadingLayout>
      </animated.div>
    </>
  )
}

export default PauseMenu
