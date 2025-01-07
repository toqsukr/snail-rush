import { zodResolver } from '@hookform/resolvers/zod'
import { usePlayerData } from '@modules/player/store'
import { useConnectSession } from '@modules/session/model/hooks/useConnectSession'
import { useKickPlayer } from '@modules/session/model/hooks/useKickPlayer'
import { useSession } from '@modules/session/store'
import Input from '@shared/input/Input'
import { useForm } from 'react-hook-form'
import LobbyUnit from '../lobby-unit/LobbyUnit'
import { useLobby } from '../store'
import { LobbyFormCodeSchema, LobbyFormCodeType } from '../type.d'

const JoinUnit = () => {
  const { username, id } = usePlayerData()
  const { session, setSession } = useSession()
  const { onClickBack } = useLobby()
  const { connectSession } = useConnectSession()
  const { kickPlayer } = useKickPlayer()

  const { register, handleSubmit, formState } = useForm<LobbyFormCodeType>({
    resolver: zodResolver(LobbyFormCodeSchema),
  })

  const onSubmit = (formData: LobbyFormCodeType) => {
    const { sessionID } = formData
    connectSession({ playerID: id ?? '', sessionID })
  }

  const handleDisconnect = async (sessionID: string, playerID: string) => {
    try {
      await kickPlayer({ sessionID, playerID })
      setSession(null)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <>
      {session && id ? (
        <>
          <LobbyUnit />
          <button onClick={() => handleDisconnect(session.session_id, id)}>DISCONNECT</button>
        </>
      ) : (
        <>
          <Input {...register('sessionID')} placeholder='Lobby code' />
          <button disabled={!username || !formState.isValid} onClick={handleSubmit(onSubmit)}>
            CONNECT
          </button>
          <button onClick={onClickBack}>BACK</button>
        </>
      )}
    </>
  )
}

export default JoinUnit
