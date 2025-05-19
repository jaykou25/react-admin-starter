import { pathToKey } from '@/layouts/businessLayout/utils'
import { findTree } from '@/utils'
import { matchPath, useLocation, useModel, useOutlet } from 'umi'

// 页面缓存组件
const CacheElements = () => {
  const { pathname } = useLocation()
  const { initialState } = useModel('@@initialState')
  const { menuDataSource } = initialState
  const { isInKeepElements, keepElements } = useModel('keep-alive')

  const targetMenu = findTree(
    menuDataSource,
    (item) => item.routeUrl === pathname
  )

  const isCache = targetMenu && targetMenu.isCache
  const element = useOutlet()

  console.log('缓存日志', { keepElements: keepElements.current })

  if (isCache && !isInKeepElements(pathname)) {
    console.log('缓存日志:', '加入缓存列表')
    keepElements?.current.set(pathname, { key: 1, element })
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
            position: 'relative',
          }}
          className="rumtime-keep-alive-layout"
          // 不匹配就隐藏, 匹配能显示
          hidden={!matchPath(pathname, cachePathname)}
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

      {/* 不缓存的页面 */}
      {!isCache && element}
    </>
  )
}

export default CacheElements
