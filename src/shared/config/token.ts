import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const TOKEN_STORAGE_KEY = 'user-access-token'

type TokenStorage = {
  token: string | null
  updateToken: (token: string) => void
  removeToken: () => void
}

export const useToken = create(
  persist<TokenStorage, [], [], Pick<TokenStorage, 'token'>>(
    (set, get) => ({
      token: null,
      updateToken: token => set({ ...get(), token }),
      removeToken: () => set({ ...get(), token: null }),
    }),
    {
      name: TOKEN_STORAGE_KEY,
      storage: createJSONStorage(() => sessionStorage),
      partialize: state => ({ token: state.token }),
    }
  )
)

export const getRawTokenFromStorage = (): string | null => useToken.getState().token

export const removeTokenEverywhere = () => {
  useToken.getState().removeToken()
}
