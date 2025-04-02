import React, { FC, PropsWithChildren } from 'react'
import css from './Menu.module.scss'
import { MenuProp } from './Menu.type'

const Menu: FC<PropsWithChildren<{}>> & MenuProp = ({ children }) => {
  return <section className={css.menu}>{children}</section>
}

const MenuButton: FC<
  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
> = ({ children, ...props }) => {
  return (
    <button {...props} className={css.menu_button}>
      {children}
    </button>
  )
}

Menu.Button = MenuButton

export default Menu
