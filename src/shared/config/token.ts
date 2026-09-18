import { useEffect } from 'react'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { expiration } from '@shared/lib/jwt'

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

const MAX_TIMEOUT = 2147483647

export const useTokenExpiry = () => {
  const token = useToken(s => s.token)
  const removeToken = useToken(s => s.removeToken)
  useEffect(() => {
    if (!token) return
    const moment = expiration(token)
    if (moment === null) return
    const rest = moment - Date.now()
    if (rest > MAX_TIMEOUT) return
    if (rest <= 0) return removeToken()
    const timer = setTimeout(removeToken, rest)
    return () => clearTimeout(timer)
  }, [token, removeToken])
}
