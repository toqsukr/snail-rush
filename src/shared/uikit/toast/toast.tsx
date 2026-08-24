import { FC, useEffect } from 'react'
import { TOAST_TIMEOUT } from '@shared/lib/toast'
import css from './toast.module.scss'

type ToastProps = { text: string; onClose: () => void }

export const Toast: FC<ToastProps> = ({ text, onClose }) => {
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
