import React, { DetailedHTMLProps, FC } from 'react'
import clsx from 'clsx'

type ButtonControllerProps = DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>

const ButtonController: FC<ButtonControllerProps> = ({ children, className, ...props }) => {
  return (
    <button
      {...props}
      tabIndex={-1}
      className={clsx(
        'xl:hidden p-6 text-[3rem] select-none rounded-3xl transition-opacity active:opacity-100 opacity-80 bg-[#ffffff66]',
        className
      )}>
      {children}
    </button>
  )
}

export default ButtonController
