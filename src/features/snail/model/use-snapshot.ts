import { RefObject, useEffect, useRef } from 'react'
import { Vector3 } from 'three'
import { RapierRigidBody } from '@react-three/rapier'
import { useSnailDeps } from '../deps'
import { useSnailContext } from '../ui/snail-provider'
import { SNAPSHOT_INTERVAL, SNAPSHOT_TOLERANCE } from './constants'
import { SnapshotType } from './types'

export const useSnapshot = (rigidBodyRef: RefObject<RapierRigidBody | null>) => {
  const { onSnapshot, snapshotEmitter } = useSnailDeps()
  const { updatePosition } = useSnailContext()
  const lastSnapshotRef = useRef(0)

  const anchor = ({ position, velocity }: SnapshotType) => {
    const snail = rigidBodyRef.current
    if (!snail) return
    const { x, y, z } = snail.translation()
    if (new Vector3(x, y, z).distanceTo(position) < SNAPSHOT_TOLERANCE) return
    snail.setTranslation(position, true)
    snail.setLinvel(velocity, true)
    updatePosition(position)
  }

  const tick = () => {
    const snail = rigidBodyRef.current
    if (!onSnapshot || !snail) return
    const now = Date.now()
    if (now - lastSnapshotRef.current < SNAPSHOT_INTERVAL) return
    lastSnapshotRef.current = now
    const { x, y, z } = snail.translation()
    const { x: vx, y: vy, z: vz } = snail.linvel()
    onSnapshot({ position: new Vector3(x, y, z), velocity: new Vector3(vx, vy, vz) })
  }

  useEffect(() => {
    const unsubscribeSnapshot = snapshotEmitter?.subscribe(anchor)
    return () => {
      unsubscribeSnapshot?.()
    }
  }, [])

  return { tick }
}
