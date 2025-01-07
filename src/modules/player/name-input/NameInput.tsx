import Input from '@shared/input/Input'
import { forwardRef, HTMLProps } from 'react'

const NameInput = forwardRef<HTMLInputElement, HTMLProps<HTMLInputElement>>((props, ref) => {
  return <Input {...props} ref={ref} placeholder='Enter your name' />
})

export default NameInput
