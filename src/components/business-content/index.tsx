import { inWhiteList, findTree } from '@/utils'
import {
  Navigate,
  useModel,
  Outlet,
  useLocation,
  matchPath,
  useOutlet,
} from 'umi'
import { pathInTree } from '@/utils/auth'
import { useContext } from 'react'
import { KeepAliveContext } from '@/contexts/keep-alive-context'
import { pathToKey } from '@/layouts/businessLayout/utils'

export default function BusinessContent() {
  const { pathname } = useLocation()

  const { keepElements = { current: [] } } = useContext(KeepAliveContext)

  const { initialState } = useModel('@@initialState')
  const { menus, routes } = initialState

  const targetRoute = findTree(menus, pathname, 'routeUrl')
  const isKeep = targetRoute && targetRoute.isCache

  const element = useOutlet()

  const isCacheInList = keepElements.current.some(
    (item) => item.pathname === pathname
  )

  if (isKeep && !isCacheInList) {
    keepElements.current.push({
      pathname,
      element,
      key: Date.now(),
    })
  }

  const childrenWithCache = () => {
    return (
      <>
        {/* 缓存的页面通过 css 显示和隐藏 */}
        {keepElements.current.map((item) => {
          const { key, element: cacheElement, pathname: pathKey } = item

          return (
            <div
              id={pathToKey(pathKey)}
              key={key}
              style={{
                minHeight: 'inherit',
                height: '100%',
                width: '100%',
                position: 'relative',
                overflow: 'hidden auto',
              }}
              className="rumtime-keep-alive-layout"
              // 不匹配就隐藏, 匹配能显示
              hidden={!matchPath(pathname, pathKey)}
            >
              {cacheElement}
            </div>
          )
        })}

        {/* 这边走不缓存的页面 */}
        {!isKeep && element}
      </>
    )
  }

  if (inWhiteList(pathname)) {
    return <Outlet />
  }

  // 当路径在routes里但不在menus里 除所有都能访问的, 返回 401
  if (
    pathInTree(pathname, routes) &&
    !pathInTree(pathname, menus, 'routeUrl')
  ) {
    return <Navigate to="/401" replace />
  } else {
    return childrenWithCache()
  }
}
