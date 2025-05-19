import { Component } from 'react'
import { ConfigProvider, Tabs } from 'antd'
import { history } from 'umi'
import { produce } from 'immer'

import type { HistoryTabType, SwitchTabsPropsType } from './type'
import { findTree } from '@/utils'

import styles from './styles.less'
import { getIcon } from '@/utils/menuUtil'

const redirectPaths = { '/welcome': '/' }

/**
 * 多页面tabs
 *
 * 实现原理:
 * 监听history事件, action为PUSH时加进列表, 为REPLACE时替换列表, 为POP时做相应的处理
 *
 * 缓存相关:
 * 由于页面集成了缓存功能, 在菜单管理页中如果勾选了页面缓存, 那么该页面会被自动缓存.
 * 缓存的页面如果没有被及时的刷新反尔会造成比较严重的问题, 我们想让缓存的刷新逻辑尽可能自动化.
 * 利用history的action来控制缓存, POP保持缓存, PUSH和REPLACE刷新缓存.
 * 简单来说就是下面这句话:
 * 👉如果跳转到某页面的action为PUSH或REPLACE的话, 该页面的缓存会自动刷新.(tab切换除外)👈
 * 一个典型的场景是:
 * 列表页跳转到详情页, 在详情页填好表单后提交, 提交成功后返回到列表页, 列表的缓存需要刷新.
 * 同时提交成功后, 详情页的tab也要关掉.
 * 那么这个场景就可以用history.replace('/list')来实现. 无需手动清缓存, 也无需手动关掉详情页的tab
 **/

class SwitchTabs extends Component<
  SwitchTabsPropsType,
  { activeKey: string; panes: HistoryTabType[] }
> {
  private unListen
  private isSwitch: boolean

  constructor(props) {
    super(props)

    this.state = {
      activeKey: '',
      panes: [],
    }

    this.isSwitch = false
  }

  componentDidMount() {
    const { menus = [] } = this.props

    /**
     * 初始数据; 页面刚进来时不会进listen
     */
    const { search } = window.location

    const pathname = this.getPathname()
    const menu = findTree(menus, (item) => item.routeUrl === pathname) || {}

    this.setState({
      panes: [{ pathname: pathname, name: menu.name, search, icon: menu.icon }],
      activeKey: pathname,
    })

    this.unListen = history.listen(({ location, action, ...rest }) => {
      const { dropByCacheKey: refresh } = this.props

      // state
      const { panes, activeKey } = this.state
      const { search } = location
      const pathname = this.getPathname(location.pathname)
      const menu = findTree(menus, (item) => item.routeUrl === pathname) || {}

      const newPane = { name: menu.name, pathname, search, icon: menu.icon }
      console.log('在 switch tabs 中监听 history', { action, pathname, rest })

      /**
       * 页面初次进来的action是pop, goBack的action也是pop
       */
      if (action === 'POP') {
        if (panes.findIndex((pane) => pane.pathname === pathname) < 0) {
          this.setState({ panes: panes.concat(newPane) })
        }

        // goBack的情况, 返回前的那个 tab 要关掉
        const newPanes = produce(panes, (draft) => {
          const prevIndex = draft.findIndex(
            (pane) => pane.pathname === activeKey
          )

          if (prevIndex > -1) {
            draft.splice(prevIndex, 1)
          }
        })

        this.setState({ panes: newPanes })
      }

      /**
       * 清空缓存的逻辑在这里
       */
      if (action === 'PUSH') {
        // 如果不存在就添加进列表(添加到上一个激活页的后面)
        // bugfix: 如果存在还要更新query
        const newPanes = produce(panes, (draft) => {
          const currentIndex = draft.findIndex(
            (pane) => pane.pathname === pathname
          )
          const prevIndex = draft.findIndex(
            (pane) => pane.pathname === activeKey
          )
          if (currentIndex < 0) {
            draft.splice(prevIndex + 1, 0, newPane)
          } else {
            draft.splice(currentIndex, 1, newPane)
          }
        })

        this.setState({ panes: newPanes })

        if (!this.isSwitch) {
          refresh(pathname)
        }

        this.isSwitch = false
      }

      if (action === 'REPLACE') {
        const newPanes = produce(panes, (draft) => {
          const currentIndex = draft.findIndex(
            (pane) => pane.pathname === pathname
          )
          const prevIndex = draft.findIndex(
            (pane) => pane.pathname === activeKey
          )

          // replace的路由在tabs列表中已存在
          if (currentIndex > -1 && currentIndex !== prevIndex) {
            draft.splice(prevIndex, 1)
          } else {
            draft.splice(prevIndex, 1, newPane)
          }
        })

        /** 已经在 layout 中监听处理了 */
        // refresh(pathname)

        this.setState({ panes: newPanes })
      }

      this.setState({ activeKey: pathname })
    })

    /**
     * 注册一个event, 用来关闭某个tab页
     */
    document.addEventListener('closeTab', this.handleCloseTab)
  }

  componentWillUnmount() {
    this.unListen()

    console.log('--------- switch tabs 解除建立监听')

    document.removeEventListener('closeTab', this.handleCloseTab)
  }

  getPathname = (paramPathname?: string) => {
    const _pathname = paramPathname || window.location.pathname
    const pathname =
      _pathname.length > 1 ? _pathname.replace(/\/+$/, '') : _pathname
    return redirectPaths[pathname] || pathname
  }

  handleCloseTab = (e) => {
    const { key } = e.detail
    this.onEdit(key, 'remove')
  }

  handleTabClick = (key) => {
    const { panes } = this.state
    const target = panes.find((pane) => pane.pathname === key)
    this.isSwitch = true
    history.push({ pathname: target!.pathname, search: target?.search })
  }

  // tabs删除功能
  onEdit = (key, action) => {
    const { panes, activeKey } = this.state

    if (action === 'remove') {
      const index = panes.findIndex((pane) => pane.pathname === key)
      if (index < 0) return
      const target = panes[index]
      const isDeleteActive = target.pathname === activeKey

      // tab可以被删说明列表中一定有两个以上
      // 如果删除的tab是当前激活的, 要改变acitveKey和history
      if (isDeleteActive) {
        let newIndex
        if (index > 0) {
          newIndex = index - 1
        } else {
          newIndex = index + 1
        }
        const newPane = panes[newIndex]
        this.setState({ activeKey: newPane.pathname })
        this.isSwitch = true
        history.push({ pathname: newPane.pathname, search: newPane.search })
      }

      const newPanes = produce(panes, (draft) => {
        draft.splice(index, 1)
      })

      this.setState({ panes: newPanes })
    }
  }

  render() {
    const { panes, activeKey } = this.state

    return (
      <ConfigProvider
        theme={{
          components: {
            Tabs: {
              cardBg: 'unset',
              titleFontSize: 12,
            },
          },
        }}
      >
        <Tabs
          type="editable-card"
          animated={false}
          activeKey={activeKey}
          style={{ ...this.props.style }}
          className={styles.mytabs}
          hideAdd={true}
          onEdit={this.onEdit}
          onTabClick={this.handleTabClick}
          items={panes.map((pane) => ({
            ...pane,
            label: pane.name || pane.pathname,
            key: pane.pathname,
            icon: getIcon(pane.icon, this.props.iconfontUrl!),
            closable: panes.length > 1,
          }))}
        />
      </ConfigProvider>
    )
  }
}

export default SwitchTabs
