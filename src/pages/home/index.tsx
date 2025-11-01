import { TrackingCamera } from '@features/tracking-camera'
import { Floor } from '@shared/lib/three'
import CountdownWithDeps from './ui/countdown-with-deps'
import FeedbackMenu from './ui/feedback-menu'
import MainMenu from './ui/main-menu'
import OpponentSuspense from './ui/opponent-snail'
import SkinMenu from './ui/skin-menu'

const HomePage = () => {
  return (
    <>
      <TrackingCamera />
      <OpponentSuspense />
      <CountdownWithDeps />
      <MainMenu />
      <FeedbackMenu />
      <SkinMenu />
      <Floor />
    </>
  )
}

export { MAIN_MENU_POSITION } from './ui/main-menu'
export { SKIN_MENU_POSITION } from './ui/skin-menu'
export default HomePage
