import Input from '@shared/uikit/input/Input'
import { FC, HTMLProps } from 'react'
import { useUpdateUsername } from '../model/use-update-username'

const UsernameInput: FC<HTMLProps<HTMLInputElement>> = ({ onChange, ...props }) => {
  const updateUsername = useUpdateUsername()

  const onInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    onChange?.(e)
    updateUsername(e.currentTarget.value)
  }

  return <Input {...props} onChange={onInputChange} placeholder='Enter username' />
}

export default UsernameInput
