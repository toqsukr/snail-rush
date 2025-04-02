import { forwardRef, HTMLProps } from 'react'
import Input from 'src/shared-old/input/Input'

const NameInput = forwardRef<HTMLInputElement, HTMLProps<HTMLInputElement>>((props, ref) => {
  return <Input {...props} ref={ref} placeholder='Enter your name' />
})

export default NameInput
