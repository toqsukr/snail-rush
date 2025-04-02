import React, { FC } from 'react'
import css from './Button.module.scss'

const Button: FC<
  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
> = ({ children, ...props }) => {
  return (
    <button {...props} className={css.button}>
      {children}
    </button>
  )
}

export default Button
