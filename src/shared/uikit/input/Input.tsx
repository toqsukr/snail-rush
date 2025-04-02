import { forwardRef, HTMLProps } from 'react'
import css from './Input.module.scss'

const Input = forwardRef<HTMLInputElement, HTMLProps<HTMLInputElement>>((props, ref) => {
  return <input ref={ref} {...props} className={css.input} />
})
export default Input
