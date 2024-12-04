import { history, useLocation, useModel } from 'umi'
import { getTreeChain } from '@/utils/treeUtil'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Input, Menu } from 'antd'

import styles from './index.less'
import { filterTreeData } from './filterTreeData'
import { isUrl } from '@/utils'
import { getMenukeys, normalizeForAntdMenu } from '@/utils/menuUtil'

const RouteMenu = (props) => {
  const { collapsed } = props
  const { pathname } = useLocation()
  const { initialState } = useModel('@@initialState')
  const { menuDataSource, iconfontUrl } = initialState

  // 左侧菜单的数据源
  const menus: any = normalizeForAntdMenu(menuDataSource, { iconfontUrl })

  /**
   * 菜单选中的数据源.
   * 与 menus 数据不同的是它会包含 isShow 为 false 的数据.
   */
  const menuChainForSelected = useMemo(
    () => getTreeChain(menuDataSource, (node) => node.routeUrl === pathname),
    [pathname]
  )

  const defaultOpenKeys = menuChainForSelected.map((item) => item.routeUrl)

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

      setOpenKeys(getMenukeys(filterMenus, (item) => item.key))
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
