import { ObjectMap, useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { AnimationAction, AnimationMixer, LoopOnce, LoopRepeat } from 'three'
import { GLTF } from 'three-stdlib'

type AnimationConfig = {
  /** Длительность анимации в секундах (переопределяет оригинальную длительность) */
  duration?: number
  /** Зациклить анимацию */
  loop?: boolean
  /** Остановить другие анимации перед запуском */
  stopOthers?: boolean
  /** Оставить модель в конечном состоянии анимации вместо сброса */
  pauseOnEnd?: boolean
  /** Вес анимации (влияет на смешивание) */
  weight?: number
  /** Время начала анимации (0-1) */
  startAt?: number
  /** Скорость воспроизведения */
  playbackSpeed?: number
}

export const useAnimation = (model: GLTF & ObjectMap) => {
  const mixerRef = useRef<AnimationMixer | null>(null)
  const actionsRef = useRef<Map<number, AnimationAction>>(new Map())
  const configsRef = useRef<Map<number, AnimationConfig>>(new Map())

  // Инициализация миксера
  useEffect(() => {
    mixerRef.current = new AnimationMixer(model.scene)
    return () => {
      actionsRef.current.forEach(action => {
        action.stop()
        action.getMixer().uncacheAction(action.getClip(), action.getRoot())
      })
      mixerRef.current?.stopAllAction()
    }
  }, [model])

  useFrame((_, delta) => {
    if (!mixerRef.current) return

    // Обновление миксера и проверка завершения анимаций
    mixerRef.current.update(delta)

    actionsRef.current.forEach((action, idx) => {
      const config = configsRef.current.get(idx)
      const clipDuration = action.getClip().duration

      // Автоматическая пауза при завершении
      if (config?.pauseOnEnd && !config?.loop && action.time >= clipDuration - 0.1) {
        action.paused = true
      }
    })
  })

  /**
   * Запускает или обновляет анимацию
   * @param animationIdx Индекс анимации в модели
   * @param config Конфигурация анимации
   */
  const animate = (animationIdx: number = 0, config: AnimationConfig = {}) => {
    if (!mixerRef.current || !model.animations[animationIdx]) {
      console.error(`Animation ${animationIdx} not found`)
      return
    }

    // Остановка других анимаций если требуется
    if (config.stopOthers) {
      stopAllAnimations()
    }

    // Сохраняем конфиг
    configsRef.current.set(animationIdx, {
      loop: false,
      pauseOnEnd: false,
      weight: 1,
      playbackSpeed: 1,
      ...config,
    })

    // Получаем или создаем действие
    let action = actionsRef.current.get(animationIdx)
    if (!action) {
      action = mixerRef.current.clipAction(model.animations[animationIdx])
      actionsRef.current.set(animationIdx, action)
    }

    // Настройка действия
    action.reset()
    action.setLoop(config.loop ? LoopRepeat : LoopOnce, Infinity)
    action.setEffectiveWeight(config.weight ?? 1)
    action.paused = false

    if (config.duration) {
      action.setDuration(config.duration)
    }

    if (config.playbackSpeed) {
      action.timeScale = config.playbackSpeed
    }

    if (config.startAt !== undefined) {
      action.time = config.startAt * action.getClip().duration
    }

    action.play()
  }

  /**
   * Останавливает анимацию
   * @param animationIdx Индекс анимации
   * @param reset Сбросить состояние модели в исходное положение
   */
  const stopAnimation = (animationIdx: number, reset: boolean = false) => {
    const action = actionsRef.current.get(animationIdx)
    if (!action) return

    if (reset) {
      action.stop()
      action.reset()
      actionsRef.current.delete(animationIdx)
      configsRef.current.delete(animationIdx)
    } else {
      action.stop()
    }
  }

  /**
   * Останавливает все анимации
   * @param reset Сбросить состояния моделей в исходное положение
   */
  const stopAllAnimations = (reset: boolean = false) => {
    actionsRef.current.forEach((_, idx) => stopAnimation(idx, reset))
  }

  /**
   * Проверяет, активна ли анимация
   */
  const isAnimationRunning = (animationIdx: number) => {
    const action = actionsRef.current.get(animationIdx)
    return action ? action.isRunning() : false
  }

  /**
   * Возвращает состояние анимации
   */
  const getAnimationState = (animationIdx: number) => {
    const action = actionsRef.current.get(animationIdx)
    if (!action) return null

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
    getActiveAnimations: () => Array.from(actionsRef.current.keys()),
    getMixer: () => mixerRef.current,
  }
}
