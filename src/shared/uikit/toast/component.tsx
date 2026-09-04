import { useEffect } from 'react'
import { ToastProps } from './types'
import { TOAST_TIMEOUT } from '@shared/lib/toast'
import { dismissToast, useToasts } from '@shared/lib/toast'
import { animated, useTransition } from '@react-spring/web'
import { HIDDEN_STYLES, SHOW_STYLES, TRANSITION_CONFIG } from './constants'
import css from './styles.module.scss'

export const Toast = ({ text, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, TOAST_TIMEOUT)

    return () => clearTimeout(timer)
  }, [])

  return (
    <button className={css.toast} onClick={onClose}>
      {text}
    </button>
  )
}

export const Toasts = () => {
  const toasts = useToasts()

  const transitions = useTransition(toasts, {
    keys: toast => toast.id,
    from: HIDDEN_STYLES,
    enter: SHOW_STYLES,
    leave: HIDDEN_STYLES,
    config: TRANSITION_CONFIG,
  })

  const handleCloseToast = (toastID: number) => {
    dismissToast(toastID)
  }

  return (
    <div className={css.toasts}>
      {transitions((style, toast) => (
        <animated.div style={style}>
          <Toast text={toast.text} onClose={() => handleCloseToast(toast.id)} />
        </animated.div>
      ))}
    </div>
  )
}
