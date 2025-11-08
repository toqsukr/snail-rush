import { FC, useState } from 'react'
import clsx from 'clsx'
import css from './clipboard-text.module.scss'

type ClipboardTextProps = { text: string; value: string; onCopy?: (value: string) => void }

export const ClipboardText: FC<ClipboardTextProps> = ({ text, value, onCopy }) => {
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
