import skinService, { type SkinDTO } from '@shared/api/skin'
import { useQuery } from '@tanstack/react-query'
import { TSkin } from './type'

const allSkinsQueryKey = 'get-all-skins'

const selectSkins: (data: SkinDTO[]) => TSkin[] = skinsDTO => {
  return skinsDTO.map(({ skin_id, ...rest }) => ({ skinID: skin_id, ...rest }))
}

export const useSkins = () => {
  return useQuery({
    queryKey: [allSkinsQueryKey],
    queryFn: () => {
      return skinService.getAllSkins()
    },
    select: skinsDTO => {
      return selectSkins(skinsDTO)
    },
  })
}

export const useSkinById = (id: string) => {
  return useQuery({
    queryKey: [allSkinsQueryKey, id],
    queryFn: () => {
      return skinService.getSkinByID(id)
    },
    select: ({ skin_id, ...rest }) => {
      return { ...rest, skinID: skin_id }
    },
    enabled: !!id,
  })
}
