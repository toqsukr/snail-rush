import { zodResolver } from '@hookform/resolvers/zod'
import { useCreatePlayer } from '@modules/player/model/hooks/useCreatePlayer'
import { useUpdatePlayer } from '@modules/player/model/hooks/useUpdatePlayer'
import NameInput from '@modules/player/name-input/NameInput'
import { usePlayerData } from '@modules/player/store'
import { CreatePlayerRequest, CreatePlayerRequestSchema } from '@modules/player/type.d'
import { useCreateSession } from '@modules/session/model/hooks/useCreateSession'
import { useDeleteSession } from '@modules/session/model/hooks/useDeleteSession'
import { useSession } from '@modules/session/store'
import debounce from 'lodash.debounce'
import { useForm } from 'react-hook-form'
import { useLobby } from '../store'

const MainUnit = () => {
  const { username, id, setPlayerData } = usePlayerData()
  const { onCreateLobby, onJoinLobby } = useLobby()
  const { createPlayer } = useCreatePlayer()
  const { createSession } = useCreateSession()
  const { updatePlayer } = useUpdatePlayer()
  const { deleteSession } = useDeleteSession()
  const { session, setSession } = useSession()

  const { register, handleSubmit, formState } = useForm<CreatePlayerRequest>({
    mode: 'onChange',
    defaultValues: { username },
    resolver: zodResolver(CreatePlayerRequestSchema),
  })

  const onUpdate = debounce((data: CreatePlayerRequest) => {
    if (id && data.username) {
      updatePlayer({ ...data, id })
    }
  }, 600)

  const onCreate = async (data: CreatePlayerRequest) => {
    onCreateLobby()
    if (!id) {
      const response = await createPlayer(data)
      setPlayerData(response)
      const sessionData = await createSession(response.id)
      setSession(sessionData)
    } else if (!session) {
      const sessionData = await createSession(id)
      setSession(sessionData)
    }
  }

  const onJoin = async (data: CreatePlayerRequest) => {
    onJoinLobby()
    if (!id) {
      const playerData = await createPlayer(data)
      setPlayerData(playerData)
    }
    if (session) {
      deleteSession(session.session_id)
    }
  }

  return (
    <>
      <NameInput {...register('username', { onChange: handleSubmit(onUpdate) })} />
      <button disabled={!username && !formState.isValid} onClick={handleSubmit(onCreate)}>
        {(session ? '' : 'CREATE') + ' LOBBY'}
      </button>
      <button disabled={!username && !formState.isValid} onClick={handleSubmit(onJoin)}>
        JOIN
      </button>
    </>
  )
}

export default MainUnit
