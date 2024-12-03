import { ls } from '.'

const key = 'ras-token'

export const getToken = (): string | undefined => {
  return ls.get(key)
}

export const setToken = (token: string) => {
  ls.set(key, token)
}

export const clearToken = () => {
  ls.remove(key)
}

export const isLogin = () => {
  return !!getToken()
}
