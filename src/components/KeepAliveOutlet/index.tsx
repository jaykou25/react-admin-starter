import { matchPath, Navigate, useLocation, useModel, useOutlet } from 'umi'
import { findTree, inWhiteList } from '@/utils'
import { pathToKey } from '@/layouts/businessLayout/utils'

const KeepAliveOutlet = (props: any) => {
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

  // +++ 加入缓存列表 +++
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

  return (
    <>
      {/* 不走缓存页面  */}
      <ToggleBox style={props.style} show={!!getElement()}>
        {props.before}
        {getElement()}
        {props.after}
      </ToggleBox>

      {/* 缓存的页面 */}
      {[...keepElements.current].map(([cachePathname, eleObj], index) => (
        <ToggleBox
          style={props.style}
          id={pathToKey(cachePathname) + '-' + eleObj.key}
          key={pathToKey(cachePathname) + '-' + eleObj.key}
          show={matchPath(pathname, cachePathname)}
        >
          {props.before}
          {eleObj.element}
          {props.after}
        </ToggleBox>
      ))}
    </>
  )
}

// 每一个页面都单独放在一个 ToggleBox 中, 确保每一个页面都有独立的滚动条, 这样在页面切换的时候可以记住每个页面的滚动位置.
// 每个 ToggleBox 都是绝对定位, 所以请确保父组件 relative.
const ToggleBox = (props: any) => {
  const { show = false, style = {}, id } = props
  return (
    <div
      id={id}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        overflow: 'auto',
        transform: show ? 'unset' : 'translate(-200%, 0)',
        ...style,
      }}
    >
      {props.children}
    </div>
  )
}

export default KeepAliveOutlet
