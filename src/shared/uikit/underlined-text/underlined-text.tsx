import React, { FC } from 'react'
import css from './underlined-text.module.scss'

type UnderlinedTextProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>

const UnderlinedText: FC<UnderlinedTextProps> = ({ children, ...props }) => {
  return (
    <button {...props} className={css.underlined_text}>
      {children}
    </button>
  )
}

export default UnderlinedText
