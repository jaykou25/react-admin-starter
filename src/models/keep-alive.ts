import { useRef, useState } from 'react'
import { SETTING_KEY, ls } from '@/utils'

const MAX_CACHE_PAGES = 2 // 最大缓存页面数量

export function setLatest(map, key, value, options?: { MAX?: number }) {
  const { MAX = 3 } = options || {}
  map.set(key, value) // 插入新数据
  if (map.size > MAX) {
    // 如果超出限制，删除最早插入的数据
    const num = map.size - MAX
    for (let i = 0; i < num; i++) {
      map.delete(map.keys().next().value)
    }
  }
}

export default () => {
  const [keepAliveKey, setKey] = useState(1)
  const keepElements = useRef<Map<string, { key: number; element: any }>>(
    new Map()
  )

  const addCache = (pathname: string, element: any) => {
    const { showSwitchTabs } = ls.get(SETTING_KEY) || {}

    if (showSwitchTabs) {
      keepElements?.current.set(pathname, { key: 1, element })
    } else {
      // 超出最大缓存页面数量，删除最旧的页面
      setLatest(
        keepElements.current,
        pathname,
        { key: 1, element },
        { MAX: MAX_CACHE_PAGES }
      )
    }
  }

  function dropByCacheKey(pathname: string) {
    if (keepElements.current.has(pathname)) {
      keepElements.current.get(pathname)!.key += 1
      setKey((val) => val + 1)
    }
  }

  function removeCachedPage(pathname: string) {
    if (keepElements.current.has(pathname)) {
      keepElements.current.delete(pathname)
      setKey((val) => val + 1)
    }
  }

  function isInKeepElements(pathname: string) {
    return keepElements.current.has(pathname)
  }

  return {
    keepElements,
    dropByCacheKey,
    removeCachedPage,
    isInKeepElements,
    keepAliveKey,
    addCache,
  }
}
