export const TOKEN_STORAGE_KEY = 'user-access-token'

export const getToken = () => sessionStorage.getItem(TOKEN_STORAGE_KEY)
export const setToken = (token: string) => sessionStorage.setItem(TOKEN_STORAGE_KEY, token)
export const removeToken = () => sessionStorage.removeItem(TOKEN_STORAGE_KEY)
