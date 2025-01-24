import { HTMLProps } from 'react'

export type ConnectType = {
  inputProps: HTMLProps<HTMLInputElement>
  connectDisabled: boolean
  handleConnect: () => void
  handleBack: () => void
}
