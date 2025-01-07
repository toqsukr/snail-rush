import { zodResolver } from '@hookform/resolvers/zod'
import { usePlayerData } from '@modules/player/store'
import { useConnectSession } from '@modules/session/model/hooks/useConnectSession'
import Input from '@shared/input/Input'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { useLobby } from '../store'
import { LobbyFormCodeSchema, LobbyFormCodeType } from '../type.d'

const JoinUnit: FC<{ handleStart: () => void }> = ({ handleStart }) => {
  const { username, id } = usePlayerData()
  const { onClickBack } = useLobby()
  const { connectSession } = useConnectSession()
  const { register, handleSubmit, formState } = useForm<LobbyFormCodeType>({
    resolver: zodResolver(LobbyFormCodeSchema),
  })

  const onSubmit = (formData: LobbyFormCodeType) => {
    const { sessionID } = formData
    connectSession({ playerID: id ?? '', sessionID })
  }

  return (
    <>
      <Input {...register('sessionID')} placeholder='Lobby code' />
      <button disabled={!username || !formState.isValid} onClick={handleSubmit(onSubmit)}>
        CONNECT
      </button>
      <button disabled={!username} onClick={onClickBack}>
        BACK
      </button>
    </>
  )
}

export default JoinUnit
