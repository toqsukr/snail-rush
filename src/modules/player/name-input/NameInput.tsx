import Input from '@shared/input/Input'
import { useRef } from 'react'
import { usePlayerData } from '../store'

const NameInput = () => {
  const { username, setUsername } = usePlayerData()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.trim()) {
      setUsername(e.target.value)
    } else {
      setUsername('')
    }
  }

  return <Input ref={inputRef} value={username} onChange={handleChange} />
}

export default NameInput
