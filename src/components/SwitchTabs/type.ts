import type CSS from 'csstype'

export type SwitchTabsPropsType = {
  style?: CSS.Properties
  menus: any[]
  dropByCacheKey?: any
}

export type HistoryTabType = {
  name: string
  pathname: string
  query?: any
  search?: string
}
