import { inWhiteList, findTree } from '@/utils'
import { Navigate, useModel, useLocation, matchPath, useOutlet } from 'umi'
import { pathToKey } from '@/layouts/businessLayout/utils'

export default function BusinessContent() {
  const { pathname } = useLocation()

  const { initialState } = useModel('@@initialState')
  const { menuDataSource, routes } = initialState

  const { isInKeepElements, keepElements } = useModel('keep-alive')

  const targetMenu = findTree(
    menuDataSource,
    (item) => item.routeUrl === pathname
  )

  const isCache = targetMenu && targetMenu.isCache
  const element = useOutlet()

  if (isCache && !isInKeepElements(pathname)) {
    console.log('缓存日志:', '加入缓存列表')
    keepElements?.current.set(pathname, { key: 1, element })
  }

  const getElement = () => {
    if (inWhiteList(pathname)) {
      return element
    }

    // 对已登录但没有该页面访问权限的控制
    if (
      findTree(routes, (item) => item.path === pathname) &&
      !findTree(menuDataSource, (item) => item.routeUrl === pathname)
    ) {
      return <Navigate to="/401" replace />
    }

    // 不缓存页面
    if (!isCache) {
      return element
    }
  }

  const renderCachedElements = () => {
    const result: any = []

    keepElements.current.forEach((eleObj, cachePathname) => {
      const cacheKey = pathToKey(cachePathname) + '-' + eleObj.key
      result.push(
        <div
          id={cacheKey}
          // 仅靠 pathname 不行, 页面缓存要失效还需要一个 key
          key={cacheKey}
          style={{
            minHeight: 'inherit',
            height: '100%',
            width: '100%',
            position: 'absolute',
            left: matchPath(pathname, cachePathname) ? 0 : '-200%',
          }}
          className="rumtime-keep-alive-layout"
          // 不匹配就隐藏, 匹配能显示
        >
          {eleObj.element}
        </div>
      )
    })

    return result
  }

  return (
    <>
      {/* 缓存的页面通过 css 控制显示和隐藏 */}
      {renderCachedElements()}

      {getElement()}
    </>
  )
}
