import { Link, useLocation, useModel } from 'umi'
import { getMenusFromData } from '../../utils/menu'
import { filterTree, getTreeChain, normalizeTree } from '@/utils/treeUtil'
import { Breadcrumb } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import { useQuery } from '@/utils'

/**
 * 根据当前面页面的路径展示面包屑
 */
const RouteBread = () => {
  const { breadName } = useQuery()

  const { pathname } = useLocation()

  const { initialState } = useModel('@@initialState')

  /**
   * 获取全部的菜单数据, 作为面包屑的数据来源
   * 这个数据源要过滤掉设置为隐藏的页面, 但是要包含当前路由的页面(当前路由页有可能也是设置为隐藏的)
   */
  const menus: any = getMenusFromData(initialState.menus, {
    filter: (item) => {
      return item.routeUrl === pathname || item.isShow
    },
  })

  // 找到目标节点, 返回从头到目标节点的数组链 (作为面包屑数据)
  const menuChain = getTreeChain(menus, (node) => node.key === pathname)

  const breadItems = menuChain.map((node, index) => {
    const item: any = {
      key: node.key,
    }

    /**
     * 当前节点满足一定条件时支持下拉菜单
     * 首先处理一下节点的children数据, 去掉当前面的路径和children是空数组的数据
     * 处理下来后如果还有子项则支持下拉
     */
    // let nodeChildren = filterTree(
    //   node.children,
    //   (node) => node.key !== pathname
    // )

    let nodeChildren = JSON.parse(JSON.stringify( node.children || [] ))
    // 去掉 childen: []的数据
    nodeChildren = normalizeTree(nodeChildren, (item) => {
      if (item.children && item.children.length === 0) {
        return { children: null }
      }
      return {}
    })

    if (nodeChildren.length > 0) {
      item.menu = {
        items: normalizeTree(nodeChildren, (node) => {
          // 如果是末级节点, 则可点击
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
      item.title = breadName || node.label
    } else {
      // 否则有子项不能点击, 无子项能点击
      item.title =
        nodeChildren.length > 0 ? (
          node.label
        ) : (
          <Link to={node.key}>{node.label}</Link>
        )
    }

    return item
  })

  // 面包屑是否加入首页
  const HAS_HOME = true
  if (HAS_HOME)
    breadItems.unshift({
      key: 'home',
      title: (
        <Link to="/">
          <HomeOutlined />
        </Link>
      ),
    })

  if (breadItems.length < 2) {
    return null
  }

  return <Breadcrumb style={{ margin: '16px 0' }} items={breadItems} />
}

export default RouteBread
