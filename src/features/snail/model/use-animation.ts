import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { AnimationAction, LoopOnce, LoopRepeat } from 'three'

type AnimationConfig = {
  /** Желаемая длительность анимации в секундах */
  duration?: number
  /** Зациклить анимацию */
  loop?: boolean
  /** Остановить другие анимации перед запуском */
  stopOthers?: boolean
  /** Оставить модель в конечном состоянии анимации */
  pauseOnEnd?: boolean
  /** Вес анимации (для смешивания) */
  weight?: number
  /** Начальное время анимации (0-1) */
  startAt?: number
}

export const useAnimation = (actions: { [key: string]: AnimationAction | null }) => {
  const configsRef = useRef<Map<string, AnimationConfig>>(new Map())
  const originalDurations = useRef<Map<string, number>>(new Map())

  useEffect(() => {
    if (!actions) return

    Object.entries(actions).forEach(([name, action]) => {
      if (action) {
        originalDurations.current.set(name, action.getClip().duration)
      }
    })
  }, [actions])

  useFrame(() => {
    if (!actions) return

    Object.entries(actions).forEach(([name, action]) => {
      const config = configsRef.current.get(name)
      if (!config || !action) return

      // Проверка завершения анимации
      if (config.pauseOnEnd && !config.loop && action.time >= action.getClip().duration - 0.1) {
        action.paused = true
      }
    })
  })

  /**
   * Запускает или обновляет анимацию
   * @param animationName Имя анимации (из GLTF)
   * @param config Конфигурация анимации
   */
  const animate = (animationName: string, config: AnimationConfig = {}) => {
    if (!actions || !actions[animationName]) {
      console.error(`Animation ${animationName} not found`)
      return
    }

    const action = actions[animationName]

    // Остановка других анимаций
    if (config.stopOthers) {
      stopAllAnimations()
    }

    // Сохраняем конфиг
    configsRef.current.set(animationName, {
      loop: false,
      pauseOnEnd: false,
      weight: 1,
      ...config,
    })

    // Настройка действия
    action.reset()
    action.setLoop(config.loop ? LoopRepeat : LoopOnce, Infinity)
    action.setEffectiveWeight(config.weight ?? 1)
    action.paused = false

    // Управление длительностью
    if (config.duration) {
      const originalDuration = originalDurations.current.get(animationName) || 1
      action.timeScale = originalDuration / config.duration
    } else {
      action.timeScale = 1
    }

    if (config.startAt !== undefined) {
      action.time = config.startAt * (originalDurations.current.get(animationName) || 1)
    }

    action.play()
  }

  /**
   * Останавливает анимацию
   * @param animationName Имя анимации
   * @param reset Сбросить в исходное состояние
   */
  const stopAnimation = (animationName: string, reset: boolean = false) => {
    if (!actions || !actions[animationName]) return

    const action = actions[animationName]
    if (reset) {
      action.stop().reset()
      configsRef.current.delete(animationName)
    } else {
      action.stop()
    }
  }

  /**
   * Останавливает все анимации
   * @param reset Сбросить состояния
   */
  const stopAllAnimations = (reset: boolean = false) => {
    if (!actions) return
    Object.keys(actions).forEach(name => stopAnimation(name, reset))
  }

  /**
   * Проверяет, активна ли анимация
   */
  const isAnimationRunning = (animationName: string) => {
    return actions?.[animationName]?.isRunning() ?? false
  }

  /**
   * Возвращает состояние анимации
   */
  const getAnimationState = (animationName: string) => {
    if (!actions || !actions[animationName]) return null

    const action = actions[animationName]
    const clip = action.getClip()

    return {
      progress: action.time / clip.duration,
      paused: action.paused,
      atEnd: !action.loop && action.time >= clip.duration,
      duration: clip.duration,
      weight: action.getEffectiveWeight(),
    }
  }

  return {
    animate,
    stopAnimation,
    stopAllAnimations,
    isAnimationRunning,
    getAnimationState,
    getActiveAnimations: () => (actions ? Object.keys(actions) : []),
  }
}
