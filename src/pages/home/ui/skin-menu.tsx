import { Suspense } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { Html } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'
import { getTexturePath, PlayerSkins } from '@features/game'
import { mainMenuDepsContext, SkinMenu as Menu, useMainMenuDeps } from '@features/menu'
import { StaticSnail } from '@features/snail'
import { useSkinById } from '@entities/skin'
import { useUser } from '@entities/user'
import { queryClient } from '@shared/api/query-client'

export const SKIN_MENU_POSITION = [7, 35, 5] satisfies [number, number, number]
const SKIN_MENU_ROTATION = [0, Math.PI / 2, 0] satisfies [number, number, number]
const SKIN_SNAIL_POSITION = [7, 41, 5] satisfies [number, number, number]
const SKIN_SNAIL_ROTATION = [0, (8 * Math.PI) / 24, 0] satisfies [number, number, number]

const SkinMenu = () => {
  const { data: user } = useUser()
  const mainMenuContextValue = useMainMenuDeps()
  const { data: skin } = useSkinById(user?.skinID ?? '')
  const texturePath = getTexturePath(skin?.name.split('.')[0] ?? PlayerSkins.HERBIVORE)

  return (
    <>
      <Html
        transform
        occlude='raycast'
        position={SKIN_MENU_POSITION}
        rotation={SKIN_MENU_ROTATION}
        portal={{ current: document.body }}>
        <QueryClientProvider client={queryClient}>
          <mainMenuDepsContext.Provider value={mainMenuContextValue}>
            <Menu />
          </mainMenuDepsContext.Provider>
        </QueryClientProvider>
      </Html>
      <Suspense>
        <StaticSnail
          texturePath={texturePath}
          position={SKIN_SNAIL_POSITION}
          rotation={SKIN_SNAIL_ROTATION}
        />
      </Suspense>
      <RigidBody
        type='fixed'
        position={[SKIN_SNAIL_POSITION[0], SKIN_SNAIL_POSITION[1] - 10, SKIN_SNAIL_POSITION[2]]}
        colliders='cuboid'
        rotation={[-Math.PI / 2, 0, 0]}
        args={[5, 5, 5]}>
        <mesh>
          <planeGeometry args={[5, 5, 5]} />
          <meshStandardMaterial color='gray' />
        </mesh>
      </RigidBody>
    </>
  )
}

export default SkinMenu
