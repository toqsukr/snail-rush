import { forwardRef, HTMLProps } from 'react'
import css from './textarea.module.scss'

const Textarea = forwardRef<HTMLTextAreaElement, HTMLProps<HTMLTextAreaElement>>((props, ref) => {
  return <textarea ref={ref} {...props} className={css.textarea} />
})

export default Textarea
