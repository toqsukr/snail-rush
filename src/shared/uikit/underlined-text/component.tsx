import { UnderlinedTextProps } from './types'
import css from './styles.module.scss'

export const UnderlinedText = ({ children, ...props }: UnderlinedTextProps) => {
  return (
    <button {...props} className={css.underlined_text}>
      {children}
    </button>
  )
}
