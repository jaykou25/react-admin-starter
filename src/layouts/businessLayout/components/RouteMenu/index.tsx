import { history, useLocation, useModel } from 'umi'
import { getMenusFromData } from '../../utils/menu'
import { getTreeChain } from '@/utils/treeUtil'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Input, Menu } from 'antd'

import styles from './index.less'
import { filterTreeData } from './filterTreeData'
import { isUrl } from '@/utils'

const getMenukeys = (menus: any = []) =>
  menus
    .map((menu) => {
      if (menu.children && menu.children.length) {
        return [menu.key, getMenukeys(menu.children)]
      }

      return undefined
    })
    .filter((item) => item)

const RouteMenu = (props) => {
  const { collapsed } = props
  const { pathname } = useLocation()
  const { initialState } = useModel('@@initialState')
  const { menus: _menus } = initialState

  // 左侧菜单的数据源
  const menus: any = getMenusFromData(_menus, {
    iconfontUrl: initialState.iconfontUrl,
  })

  /**
   * 用于菜单选中的数据源.
   * 它与菜单数据源的区别是它包含当前页面的路径, 而当前路径有可能是隐藏的, 所以菜单数据源里不一定包含.
   */
  const menusForSelected: any = getMenusFromData(_menus, {
    filter: (item) => {
      return item.routeUrl === pathname || item.isShow
    },
  })

  const menuChainForSelected = useMemo(
    () => getTreeChain(menusForSelected, (node) => node.key === pathname),
    [pathname]
  )

  const defaultOpenKeys = menuChainForSelected.map((item) => item.key)
  // console.log('defaultOpenKeys', defaultOpenKeys)

  const [keyWord, setKeyWord] = useState('')
  const [selectedKeys, setSelectedKeys] = useState<string[]>(defaultOpenKeys)
  const [openKeys, setOpenKeys] = useState<string[]>(defaultOpenKeys)
  const mountRef = useRef(false)

  useEffect(() => {
    setSelectedKeys(defaultOpenKeys)
    setOpenKeys(defaultOpenKeys)
  }, [defaultOpenKeys.join(',')])

  const filterMenus = filterTreeData(menus || [], keyWord, {
    fieldNames: { children: 'children' },
    treeNodeFilterProp: 'label',
  })

  useEffect(() => {
    if (mountRef.current) {
      if (!keyWord) {
        setOpenKeys([])
        return
      }

      setOpenKeys(getMenukeys(filterMenus).flat(Infinity))
    }
    mountRef.current = true
  }, [keyWord])

  function onClickMenuItem(item) {
    if (isUrl(item.key)) {
      window.open(item.key, '_blank')
      return
    }
    history.push(item.key)
  }

  // 页面路由变化后要重新选中菜单
  useEffect(() => {
    setSelectedKeys(defaultOpenKeys)
  }, [pathname])

  return (
    <div>
      {!collapsed && (
        <div style={{ padding: '15px 10px 0 10px' }}>
          <Input
            allowClear
            placeholder="搜索菜单"
            value={keyWord}
            onChange={(e) => {
              setKeyWord(e.currentTarget.value)
            }}
          />
        </div>
      )}
      <div className={styles.sideMenu}>
        <Menu
          style={{ borderInlineEnd: 'none' }}
          mode="inline"
          inlineIndent={20}
          items={filterMenus}
          onClick={onClickMenuItem}
          selectedKeys={selectedKeys}
          onSelect={({ selectedKeys: keys }) => {
            console.log('selectedKeys', keys)
            setSelectedKeys(keys)
          }}
          openKeys={openKeys}
          onOpenChange={(keys) => setOpenKeys(keys)}
        />
      </div>
    </div>
  )
}

export default RouteMenu
