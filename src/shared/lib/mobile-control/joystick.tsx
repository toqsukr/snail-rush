import clsx from 'clsx'
import { DetailedHTMLProps, FC, HTMLAttributes, useEffect, useRef, useState } from 'react'

type PercentPosition = { x: `${number}%`; y: `${number}%` }

type ControllerOptions = {
  onLeft?: () => void
  onRight?: () => void
  onTop?: () => void
  onBottom?: () => void
  onReset?: () => void
}

function calcPercent(value: number, totalValue: number) {
  return (value * 100) / totalValue
}

const initStickPosition: PercentPosition = { x: '-50%', y: '-50%' }

type JoystickControllerProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> &
  ControllerOptions

export const JoystickController: FC<JoystickControllerProps> = ({
  onLeft,
  onRight,
  onTop,
  onBottom,
  onReset,
  className,
  ...props
}) => {
  const joyRef = useRef<HTMLElement>(null)
  const stickRef = useRef<HTMLButtonElement>(null)
  const startTouch = useRef(false)
  const activeTouchId = useRef<number | null>(null)
  const [maxMove, setMaxMove] = useState(0)
  const [stickPercentPosition, setStickPosition] = useState<PercentPosition>(initStickPosition)

  useEffect(() => {
    if (joyRef.current && stickRef.current) {
      setMaxMove(joyRef.current.offsetWidth / 2 - stickRef.current.offsetWidth / 2)
    }
  }, [])

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (!joyRef.current) return
      if (activeTouchId.current === null && joyRef.current.contains(e.target as Node)) {
        activeTouchId.current = e.changedTouches[0].identifier
        startTouch.current = true
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!startTouch.current || !joyRef.current || maxMove === 0) return
      const touch = Array.from(e.touches).find(t => t.identifier === activeTouchId.current)
      if (!touch) return

      const rect = joyRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const moveX = touch.clientX - centerX
      const moveY = touch.clientY - centerY

      const distance = Math.sqrt(moveX ** 2 + moveY ** 2)
      const angle = Math.atan2(moveY, moveX)

      const clampedDistance = Math.min(distance, maxMove)
      const clampedX = Math.cos(angle) * clampedDistance
      const clampedY = Math.sin(angle) * clampedDistance

      const percentX = calcPercent(clampedX, maxMove)
      const percentY = calcPercent(clampedY, maxMove)

      if (percentX >= 70) onRight?.()
      if (percentX <= -70) onLeft?.()
      if (percentY <= -70) onTop?.()
      if (percentY >= 70) onBottom?.()

      setStickPosition({
        x: `${percentX - 50}%`,
        y: `${percentY - 50}%`,
      })
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (Array.from(e.changedTouches).some(t => t.identifier === activeTouchId.current)) {
        activeTouchId.current = null
        startTouch.current = false
        onReset?.()
        setStickPosition(initStickPosition)
      }
    }

    document.addEventListener('touchstart', handleTouchStart)
    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [maxMove, onLeft, onRight, onTop, onBottom, onReset])

  return (
    <aside
      {...props}
      ref={joyRef}
      className={clsx(
        'xl:hidden fixed bottom-4 left-8 p-16 rounded-full bg-[#ffffff55]',
        className
      )}>
      <button
        ref={stickRef}
        tabIndex={-1}
        className='absolute top-1/2 left-1/2 p-6 rounded-full bg-[#ffffff66]'
        style={{
          transform: `translate(${stickPercentPosition.x}, ${stickPercentPosition.y})`,
        }}
      />
    </aside>
  )
}
