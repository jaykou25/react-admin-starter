import { filterTree, getTreeChain, normalizeTree } from './treeUtil'

import Icon, { createFromIconfontCN, HomeOutlined } from '@ant-design/icons'

import { isImg, isUrl } from '@/utils'
import { Link } from 'umi'

const getIcon = (
  icon: string | React.ReactNode,
  iconfontUrl: string,
  iconPrefixes: string = 'icon-'
): React.ReactNode => {
  const IconFont = createFromIconfontCN({
    scriptUrl: iconfontUrl,
  })

  if (typeof icon === 'string' && icon !== '') {
    if (isUrl(icon) || isImg(icon)) {
      return (
        <Icon
          component={() => (
            <img src={icon} alt="icon" className="ant-pro-sider-menu-icon" />
          )}
        />
      )
    }
    if (icon.startsWith(iconPrefixes)) {
      return <IconFont type={icon} />
    }
  }
  return icon
}

// 将后端返回的菜单数据转化成符合 antd menus 的数据格式
export const normalizeForAntdMenu = (
  data: any[],
  options?: { iconfontUrl: string }
) => {
  // type 为 2 的是按钮, 需过滤
  const afterFilter = filterTree(data, (item) => item.type < 2 && item.isShow)

  const { iconfontUrl } = options || {}

  return normalizeTree(
    afterFilter,
    (item) => {
      return {
        key: item.routeUrl,
        label: item.name,
        title: item.name,
        icon: iconfontUrl ? getIcon(item.icon, iconfontUrl) : null,
        children:
          item.children && item.children.length > 0 ? item.children : null,
      }
    },
    { replace: true }
  )
}

export const getMenukeys = (data: any[], fn: (item: any) => any): any[] => {
  const result: any = []

  filterTree(data, (item) => {
    result.push(fn(item))
    return true
  })

  // 去重
  const arr = Array.from(new Set(result))

  // 去空
  return arr.filter((item) => !!item)
}

// 根据 pathname 和菜单数据获取 Breadcrumb 组件所需要的 items 数据
export const getBreadItems = (
  menuDataSource: any[],
  pathname: string,
  options?: {
    leafBreadName: string
  }
): any[] => {
  const menus = filterTree(menuDataSource, (item) => item.type < 2)

  // 找到目标节点, 返回从头到目标节点的数组链 (作为面包屑数据)
  const menuChain = getTreeChain(menus, (node) => node.routeUrl === pathname)

  const breadItems = menuChain.map((node, index) => {
    const item: any = {
      key: node.routeUrl,
    }

    const allChildren = normalizeForAntdMenu(node.children || [])

    // 下拉项中去除掉当前面包屑上已经存在的项
    const nextNode = menuChain[index + 1] || {}
    const availableChildren = allChildren.filter(
      (item) => item.key !== nextNode.routeUrl
    )

    // 面包屑可下拉
    if (availableChildren.length > 0) {
      item.menu = {
        items: normalizeTree(availableChildren, (node) => {
          // 下拉中是末级的节点可点击
          if (!(node.children && node.children.length)) {
            return { label: <Link to={node.key}>{node.label}</Link> }
          }
        }),
      }
    }

    /**
     * 当节点是最后一个节点时
     * title 可以从路由中取
     */
    if (index === menuChain.length - 1) {
      item.title = options?.leafBreadName || node.name
    } else {
      // 否则有子项不能点击, 无子项能点击
      item.title =
        allChildren.length > 0 ? (
          node.name
        ) : (
          <Link to={node.routeUrl}>{node.name}</Link>
        )
    }

    return item
  })

  breadItems.unshift({
    key: 'home',
    title: (
      <Link to="/">
        <HomeOutlined />
      </Link>
    ),
  })

  if (breadItems.length < 2) {
    return []
  }

  return breadItems
}
