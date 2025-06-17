import Input from '@shared/uikit/input/Input'
import { FC, HTMLProps } from 'react'
import { useTranslation } from 'react-i18next'
import { useUpdateUsername } from '../model/use-update-username'

const UsernameInput: FC<HTMLProps<HTMLInputElement>> = ({ onChange, ...props }) => {
  const updateUsername = useUpdateUsername()
  const { t } = useTranslation()

  const onInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    onChange?.(e)
    updateUsername(e.currentTarget.value)
  }

  return <Input {...props} onChange={onInputChange} placeholder={t('username_input_placeholder')} />
}

export default UsernameInput
