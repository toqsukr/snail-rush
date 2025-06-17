import { TrackingCamera } from '@features/tracking-camera'
import { Floor } from '@shared/lib/three'
import CountdownWithDeps from './ui/countdown-with-deps'
import MainMenu from './ui/main-menu'
import OpponentSuspense from './ui/opponent-snail'
import SkinMenu from './ui/skin-menu'

const LIGHT_POSITION = [5, 1, 0] satisfies [number, number, number]

const HomePage = () => {
  return (
    <>
      <TrackingCamera />
      <OpponentSuspense />
      <CountdownWithDeps />
      <MainMenu />
      <Floor />
      <SkinMenu />
      <ambientLight position={LIGHT_POSITION} intensity={1} />
    </>
  )
}

export { FINISH_POSITION } from './ui/game-map'
export { MAIN_MENU_POSITION } from './ui/main-menu'
export { SKIN_MENU_POSITION } from './ui/skin-menu'
export default HomePage
