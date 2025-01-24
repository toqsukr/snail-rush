import { zodResolver } from '@hookform/resolvers/zod'
import { usePlayerData } from '@modules/player/store'
import { useConnectSession } from '@modules/session/model/hooks/useConnectSession'
import { useKickPlayer } from '@modules/session/model/hooks/useKickPlayer'
import { useSession } from '@modules/session/store'
import { SessionType } from '@modules/session/type'
import Menu from '@shared/menu/Menu'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { useLobby } from '../store'
import { LobbyFormCodeSchema, LobbyFormCodeType } from '../type.d'
import Connect from './connect/Connect'
import Disconnect from './disconnect/Disconnect'

const JoinUnit: FC<{ playerID: string }> = ({ playerID }) => {
  const { onClickBack } = useLobby()
  const { username } = usePlayerData()
  const { kickPlayer } = useKickPlayer()
  const { session, setSession } = useSession()
  const { connectSession } = useConnectSession()

  const { register, handleSubmit, formState } = useForm<LobbyFormCodeType>({
    resolver: zodResolver(LobbyFormCodeSchema),
  })

  const onSubmit = (formData: LobbyFormCodeType) => {
    const { sessionID } = formData
    connectSession({ playerID, sessionID })
  }

  const handleDisconnect = async (sessionID: string, playerID: string) => {
    try {
      await kickPlayer({ sessionID, playerID })
      setSession(null)
    } catch (e) {
      console.error(e)
    }
  }

  const getContent = (session: SessionType | null) => {
    if (session)
      return <Disconnect handleDisconnect={() => handleDisconnect(playerID, session.session_id)} />
    return (
      <Connect
        inputProps={register('sessionID')}
        handleBack={onClickBack}
        handleConnect={handleSubmit(onSubmit)}
        connectDisabled={!username || !formState.isValid}
      />
    )
  }

  return <Menu>{getContent(session)}</Menu>
}

export default JoinUnit
