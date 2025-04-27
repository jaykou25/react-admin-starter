import { history, createSearchParams } from 'umi'

import {
  isLogin,
  inWhiteList,
  fullPath,
  afterLogin,
  normalizeTree,
  setToken,
  getQuery,
} from '@/utils'
import dayjs from 'dayjs'
import { casLogin } from './apis'

const advancedFormat = require('dayjs/plugin/advancedFormat')
dayjs.extend(advancedFormat)

declare global {
  interface Window {
    routes: any
    _isAdmin: boolean
  }
}

export async function getInitialState(): Promise<any> {
  const { pathname } = window.location
  const { ticket } = getQuery()

  const initialState: any = {
    // 系统的路由数据, 用于页面权限控制
    routes: normalizeTree(window.routes, (item) => {
      return { ...item, path: '/' + item.path }
    }),
  }

  // 如果 url 上带有 ticket 则实行单点登录
  if (ticket) {
    try {
      const token: any = await casLogin({ ticket: encodeURIComponent(ticket) })
      setToken(token)
    } catch (e) {
      console.error('单点登录失败', e)
      history.replace('/sso')
      return initialState
    }
  }

  if (inWhiteList(pathname)) {
    return initialState
  }

  if (!isLogin()) {
    history.replace({
      pathname: '/login',
      search: createSearchParams({ redirect: fullPath() }).toString(),
    })

    return initialState
  } else {
    try {
      const initValue: any = await afterLogin()
      return { ...initialState, ...initValue }
    } catch (e) {
      return initialState
    }
  }
}

export function patchClientRoutes({ routes }) {
  console.log('routes', routes)

  window.routes = routes[0].routes
}

export function render(oldRender) {
  console.log('启动')
  oldRender()
}
