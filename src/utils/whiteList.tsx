// 白名单页面一般是一些静态页.
// 或者是调用的接口不需要带 token 的, 比如登陆页

import { Outlet } from 'umi'
import LoginLayout from '@/layouts/login-layout/index'
import BusinessLayout from '@/layouts/businessLayout'

// 同时请指定好每个页面所对应的布局.
const WhiteListMap = new Map([
  [/^\/login/, <LoginLayout />],
  [/^\/sso/, <Outlet />],
  [/^\/401/, <BusinessLayout />],
  [/^\/404/, <Outlet />],
])

export const inWhiteList = (pathname: string) => {
  const keys = WhiteListMap.keys()
  let result = false

  for (let reg of keys) {
    if (reg.test(pathname)) {
      result = true
      break
    }
  }

  return result
}

export const getWhiteListLayout = (pathname: string) => {
  if (inWhiteList(pathname)) {
    const keys = WhiteListMap.keys()
    let result

    for (let reg of keys) {
      if (reg.test(pathname)) {
        result = WhiteListMap.get(reg)
        break
      }
    }

    return result
  }

  return <Outlet />
}
