import MainMenu from '@modules/lobby/main-menu/MainMenu'
import HTMLLayout from '@shared/html-layout/HTMLLayout'

const MenuScene = () => {
  return (
    <HTMLLayout position={[0, 35, -10]} rotation={[0, Math.PI, 0]}>
      <MainMenu />
    </HTMLLayout>
  )
}

export default MenuScene
