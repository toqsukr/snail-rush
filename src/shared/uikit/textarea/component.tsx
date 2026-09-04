import { forwardRef } from 'react'
import { TextAreaProps } from './types'
import css from './styles.module.scss'

export const Textarea = forwardRef<HTMLTextAreaElement, TextAreaProps>((props, ref) => {
  return <textarea ref={ref} {...props} className={css.textarea} />
})
