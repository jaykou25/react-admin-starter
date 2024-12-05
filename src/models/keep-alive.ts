import { useRef, useState } from 'react'

export default () => {
  const [keepAliveKey, setKey] = useState(1)
  const keepElements = useRef<Map<string, any>>(new Map())

  function dropByCacheKey(pathname: string) {
    if (keepElements.current.has(pathname)) {
      keepElements.current.delete(pathname)
      setKey((val) => val + 1)
    }
  }

  function isInKeepElements(pathname: string) {
    return keepElements.current.has(pathname)
  }

  return { keepElements, dropByCacheKey, isInKeepElements, keepAliveKey }
}
