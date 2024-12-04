import { createSearchParams, history } from 'umi'
import { queryConfig, queryCurrent, queryDicts, queryMenu } from '@/apis'
import { normalizeTree, ss } from '@/utils'

/**
 * 此方法会跳转到 redirect 参数所在的位置
 * sessionStorage里有redirect优先跳转
 */
export function goto() {
  if (!history) return

  /**
   * 如果用户没有任何菜单权限, 转到提示页
   */
  if (window['_noMenu']) {
    history.replace('/noMenu')
    return
  }

  const { search } = window.location
  setTimeout(() => {
    let finalRedirect
    const sessionRedirect = ss.get('redirect')
    if (sessionRedirect) {
      finalRedirect = sessionRedirect
      ss.remove('redirect')
    } else {
      const redirect = createSearchParams(search).get('redirect')
      finalRedirect = redirect
    }

    history.push(finalRedirect || '/')
  }, 200)
}

// 登录成功后做的操作
// 返回 promise
export function afterLogin() {
  return new Promise(async (resolve, reject) => {
    // 这是后台返回的该用户的所有菜单数据源
    const menuDataSource = await queryMenu()

    // 当前用户信息
    const currentUser = await queryCurrent()

    // 获取所有的数据字典
    const dictRes = await queryDicts({ current: 1, pageSize: 1000 })

    // iconfontUrl
    const config = await queryConfig(1)
    const iconfontUrl = config?.value

    const initValue = {
      menuDataSource,
      currentUser,
      iconfontUrl,
      dictData: dictRes.data,
    }

    // 存在window上的全局数据, 有的class组件不能用useModel
    window['_isAdmin'] = (currentUser.rolesList || []).some(
      (role) => role.tag === 'admin'
    )

    window['_companyId'] = currentUser.userInfo?.companyId

    window['_orgId'] = currentUser.userInfo?.orgId

    window['_userId'] = currentUser.userInfo?.userId

    // 权限列表
    const codes: string[] = []
    normalizeTree(menuDataSource, (item: any) => {
      codes.push(item.code)
      return undefined
    })
    window['_codes'] = codes

    if (menuDataSource.length < 1) {
      window['_noMenu'] = true
    } else {
      window['_noMenu'] = false
    }

    resolve(initValue)
  })
}
