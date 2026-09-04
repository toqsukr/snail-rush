import clsx from 'clsx'
import { useState } from 'react'
import { ClipboardTextProps } from './types'
import css from './styles.module.scss'

export const ClipboardText = ({ text, value, onCopy }: ClipboardTextProps) => {
  const [active, setActive] = useState(false)

  const handleTextClick = () => {
    setActive(true)
    setTimeout(() => setActive(false), 300)
    navigator.clipboard.writeText(value)
    onCopy?.(value)
  }

  return (
    <button
      className={clsx(css.clipboard_text, { [css.clipboard_text_active]: active })}
      onClick={handleTextClick}>
      {text}
    </button>
  )
}
