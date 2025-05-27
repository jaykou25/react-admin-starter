import type CSS from 'csstype'

export type SwitchTabsPropsType = {
  style?: CSS.Properties
  menus: any[]
  dropByCacheKey?: any
  removeCachedPage?: any
  iconfontUrl?: string
}

export type HistoryTabType = {
  name: string
  pathname: string
  query?: any
  search?: string
  icon?: string
}
