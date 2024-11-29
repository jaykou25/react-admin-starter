// 白名单指的是不需要权限接口的页面, 像中台项目的首页'/'需要展示菜单数据, 那么就不属于白名单
export const inWhiteList = (pathname: string) => {
  // if (/^\/home/.test(pathname)) {
  //   return true
  // }

  /**
   * 风险分布图大屏版
   * 这个页面的接口是免登的
   */
  if (/^\/riskMapScreen/.test(pathname)) {
    return true
  }
  // 财务中心大屏
  if (/^\/financialCenter/.test(pathname)) {
    return true
  }

  /**
   * 大屏轮播图
   * 这个页面的接口是免登的
   */
  if (/^\/banner/.test(pathname)) {
    return true
  }

  // 没有任何菜单的提示页
  if (/^\/noMenu/.test(pathname)) {
    return true
  }

  // 维护页
  if (/^\/maintain/.test(pathname)) {
    return true
  }

  // 401, 404
  if (/^\/40/.test(pathname)) {
    return true
  }

  // 用户页
  if (/^\/login/.test(pathname)) {
    return true
  }

  // dashboard
  if (/^\/dashboard/.test(pathname)) {
    return true
  }

  // sso
  if (/^\/sso/.test(pathname)) {
    return true
  }

  // if (/^\/risk/.test(pathname)) {
  //   return true
  // }
  return false
}
