import { createContext, useContext } from 'react'

/**
 * KeepAlive 上下文
 * 提供 dropByCacheKey 方法, 用于清除页面缓存
 */
export const KeepAliveContext = createContext<{
  keepElements?: any
  dropByCacheKey?: (path) => void
  isActive: (key: string) => Boolean // 判断当前的页面是否是激活状态, 激活是指已缓存的页面是否处在前台
}>({ isActive: () => true })

export const useAlive = () => {
  const state = useContext(KeepAliveContext)
  return state
}
