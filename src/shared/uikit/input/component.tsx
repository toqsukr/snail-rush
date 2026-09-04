import { forwardRef } from 'react'
import { InputProps } from './types'
import css from './styles.module.scss'

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <input ref={ref} {...props} className={css.input} />
})
