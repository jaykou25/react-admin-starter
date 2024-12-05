import { inWhiteList, findTree } from '@/utils'
import { Navigate, useModel, Outlet, useLocation } from 'umi'
import CacheElements from '../cache-elements'

export default function BusinessContent() {
  const { pathname } = useLocation()

  const { initialState } = useModel('@@initialState')
  const { menuDataSource, routes } = initialState

  if (inWhiteList(pathname)) {
    return <Outlet />
  }

  // 对已登录但没有该页面访问权限的控制
  if (
    findTree(routes, (item) => item.path === pathname) &&
    !findTree(menuDataSource, (item) => item.routeUrl === pathname)
  ) {
    return <Navigate to="/401" replace />
  } else {
    return <CacheElements />
  }
}
