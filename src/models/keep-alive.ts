import { useRef, useState } from 'react'

export default () => {
  const [keepAliveKey, setKey] = useState(1)
  const keepElements = useRef<Map<string, { key: number; element: any }>>(
    new Map()
  )

  function dropByCacheKey(pathname: string) {
    if (keepElements.current.has(pathname)) {
      keepElements.current.get(pathname)!.key += 1
      setKey((val) => val + 1)
    }
  }

  function isInKeepElements(pathname: string) {
    return keepElements.current.has(pathname)
  }

  return { keepElements, dropByCacheKey, isInKeepElements, keepAliveKey }
}
