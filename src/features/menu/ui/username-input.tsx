import Input from '@shared/uikit/input/Input'
import { FC, HTMLProps } from 'react'
import { useUpdateUser } from '../model/use-update-user'

const UsernameInput: FC<HTMLProps<HTMLInputElement>> = ({ onChange, ...props }) => {
  const updateUser = useUpdateUser()

  const onInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    onChange?.(e)
    updateUser(e.currentTarget.value)
  }

  return <Input {...props} onChange={onInputChange} />
}

export default UsernameInput
