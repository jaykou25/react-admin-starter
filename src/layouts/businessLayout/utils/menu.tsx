import Icon, { createFromIconfontCN } from '@ant-design/icons'

import { filterTree, normalizeTree } from '@/utils/treeUtil'
import { isImg, isUrl } from '@/utils'

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

/**
 * 将后端返回的菜单数据转化成符合 antd menus 的数据格式
 * 默认只取 item.isShow && item.type < 2 的数据
 * 也可以传入一个 filter 函数来自定义取数逻辑
 * @param data
 */
export const getMenusFromData = (
  data = [],
  options?: { iconfontUrl?: string; filter?: (item) => boolean }
) => {
  const { iconfontUrl, filter } = options || {}
  const filterData = filterTree(data, (item) => {
    if (filter && typeof filter === 'function') {
      return filter(item)
    }

    // type 为 2 的是按钮, 不是菜单
    return item.isShow && item.type < 2
  })

  return normalizeTree(
    filterData,
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
