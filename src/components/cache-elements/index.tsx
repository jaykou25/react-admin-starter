import { pathToKey } from '@/layouts/businessLayout/utils'
import { findTree } from '@/utils'
import { useEffect } from 'react'
import { matchPath, useLocation, useModel, useOutlet, history } from 'umi'

// 页面缓存组件
const CacheElements = () => {
  const { pathname } = useLocation()
  const { initialState } = useModel('@@initialState')
  const { menuDataSource } = initialState
  const { keepAliveKey, isInKeepElements, keepElements, dropByCacheKey } =
    useModel('keep-alive')

  const targetMenu = findTree(
    menuDataSource,
    (item) => item.routeUrl === pathname
  )

  const isCache = targetMenu && targetMenu.isCache
  const element = useOutlet()

  if (isCache && !isInKeepElements(pathname)) {
    keepElements?.current.set(pathname, element)
  }

  useEffect(() => {
    const unlisten = history.listen((update: any) => {
      const { action, location } = update
      const { pathname: currentPathname } = location

      if (action === 'PUSH') {
        dropByCacheKey(currentPathname)
      }

      if (action === 'REPLACE') {
        dropByCacheKey(currentPathname)
      }
    })

    return () => {
      unlisten()
    }
  }, [])

  const renderCachedElements = () => {
    const result: any = []

    keepElements.current.forEach((ele, cachePathname) => {
      const cacheKey = pathToKey(cachePathname) + '-' + keepAliveKey
      result.push(
        <div
          id={cacheKey}
          // 仅靠 pathname 不行, 页面缓存要失效还需要一个 key
          key={cacheKey}
          style={{
            minHeight: 'inherit',
            height: '100%',
            width: '100%',
            position: 'relative',
          }}
          className="rumtime-keep-alive-layout"
          // 不匹配就隐藏, 匹配能显示
          hidden={!matchPath(pathname, cachePathname)}
        >
          {ele}
        </div>
      )
    })

    return result
  }

  return (
    <>
      {/* 缓存的页面通过 css 控制显示和隐藏 */}
      {renderCachedElements()}

      {/* 不缓存的页面 */}
      {!isCache && element}
    </>
  )
}

export default CacheElements
