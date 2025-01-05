import { animated, useSpring } from '@react-spring/three'
import { useGLTF } from '@react-three/drei'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import { Object3D, Object3DEventMap } from 'three'
import { useAppState } from '../store'

const Menu = forwardRef<Object3D<Object3DEventMap>, { handleStart: () => void }>(
  ({ handleStart }, ref) => {
    const { onGameStart } = useAppState()
    const { scene } = useGLTF('models/menu/menu.glb')
    const menuRef = useRef<Object3D>(null)

    useImperativeHandle(ref, () => menuRef.current as Object3D)

    const [springProps, api] = useSpring(() => ({
      scale: 1,
      config: { mass: 1, tension: 200, friction: 20 },
    }))

    const handlePointerEnter = () => {
      api.start({ scale: 1.01 })
    }

    const handlePointerLeave = () => {
      api.start({ scale: 1 })
    }

    const handleClick = () => {
      handleStart()
      onGameStart()
    }

    return (
      <animated.mesh
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        scale={springProps.scale}>
        <primitive
          object={scene}
          ref={menuRef}
          onClick={handleClick}
          position={[0, 14, -4]}
          rotation={[Math.PI / 2, 0, Math.PI]}
        />
      </animated.mesh>
    )
  }
)

export default Menu
