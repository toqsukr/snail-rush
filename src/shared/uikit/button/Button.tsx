import React, { FC } from 'react'
import css from './Button.module.scss'

export type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  onClick?: () => void
}

const Button: FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button {...props} className={css.button}>
      {children}
    </button>
  )
}

export default Button
