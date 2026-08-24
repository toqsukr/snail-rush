import { animated, useTransition } from '@react-spring/web'
import { dismissToast, useToasts } from '@shared/lib/toast'
import { Toast } from './toast'
import css from './toast.module.scss'

const HIDDEN = { opacity: 0, transform: 'translateY(-1.5rem) scale(0.9)' }

export const Toasts = () => {
  const toasts = useToasts()

  const transitions = useTransition(toasts, {
    keys: toast => toast.id,
    from: HIDDEN,
    enter: { opacity: 1, transform: 'translateY(0rem) scale(1)' },
    leave: HIDDEN,
    config: { tension: 300, friction: 26 },
  })

  return (
    <div className={css.toasts}>
      {transitions((style, toast) => (
        <animated.div style={style}>
          <Toast text={toast.text} onClose={() => dismissToast(toast.id)} />
        </animated.div>
      ))}
    </div>
  )
}
