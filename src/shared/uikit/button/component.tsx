import { ButtonProps } from './types'
import css from './styles.module.scss'

export const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button tabIndex={0} {...props} className={css.button}>
      {children}
    </button>
  )
}
