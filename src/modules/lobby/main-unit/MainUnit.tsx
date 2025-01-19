import { zodResolver } from '@hookform/resolvers/zod'
import { useCreatePlayer } from '@modules/player/model/hooks/useCreatePlayer'
import { useUpdatePlayer } from '@modules/player/model/hooks/useUpdatePlayer'
import NameInput from '@modules/player/name-input/NameInput'
import { usePlayerData } from '@modules/player/store'
import { CreatePlayerRequest, CreatePlayerRequestSchema } from '@modules/player/type.d'
import { useCreateSession } from '@modules/session/model/hooks/useCreateSession'
import { useDeleteSession } from '@modules/session/model/hooks/useDeleteSession'
import { useSession } from '@modules/session/store'
import Menu from '@shared/menu/Menu'
import debounce from 'lodash.debounce'
import { useForm } from 'react-hook-form'
import { useLobby } from '../store'

const MainUnit = () => {
  const { username, player_id, setPlayerData } = usePlayerData()
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
    if (player_id && data.username) {
      updatePlayer({ ...data, player_id })
    }
  }, 1500)

  const onCreate = async (data: CreatePlayerRequest) => {
    onCreateLobby()
    if (!player_id) {
      const response = await createPlayer(data)
      setPlayerData(response)
      const sessionData = await createSession(response.player_id)
      setSession(sessionData)
    } else if (!session) {
      const sessionData = await createSession(player_id)
      setSession(sessionData)
    }
  }

  const onJoin = async (data: CreatePlayerRequest) => {
    onJoinLobby()
    if (!player_id) {
      const playerData = await createPlayer(data)
      setPlayerData(playerData)
    }
    if (session) {
      deleteSession(session.session_id)
    }
  }

  return (
    <Menu>
      <NameInput {...register('username', { onChange: handleSubmit(onUpdate) })} />
      <Menu.Button disabled={!username && !formState.isValid} onClick={handleSubmit(onCreate)}>
        {(session ? '' : 'CREATE') + ' LOBBY'}
      </Menu.Button>
      <Menu.Button disabled={!username && !formState.isValid} onClick={handleSubmit(onJoin)}>
        JOIN
      </Menu.Button>
    </Menu>
  )
}

export default MainUnit
