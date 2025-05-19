import { useEffect, useState } from 'react'
import { Layout, theme, Spin } from 'antd'

import Navbar from './components/Navbar'
import RouteBread from './components/RouteBread'
import RouteMenu from './components/RouteMenu'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { useModel, history } from 'umi'
import { SETTING_KEY, ls } from '@/utils'

import './styles.less'
import BusinessContent from '@/components/business-content'
import SwitchTabs from '@/components/SwitchTabs'

const { Header, Content, Sider, Footer } = Layout

const BusinessLayout = () => {
  const { initialState } = useModel('@@initialState')
  const { collapsed, setCollapsed } = useModel('collapsed')
  const { loading } = useModel('loading')
  const [eventLoading, setEventLoading] = useState(false)
  const { dropByCacheKey } = useModel('keep-alive')

  useModel('render')

  const { showSwitchTabs, compactMode } = ls.get(SETTING_KEY) || {}

  useEffect(() => {
    let unlisten

    if (!showSwitchTabs) {
      unlisten = history.listen((update: any) => {
        console.log('全局 keepalive listen')
        const { action, location } = update
        const { pathname: currentPathname } = location
        if (action === 'PUSH') {
          dropByCacheKey(currentPathname)
        }
        if (action === 'REPLACE') {
          dropByCacheKey(currentPathname)
        }
      })
    }

    return () => {
      if (unlisten) {
        unlisten()
      }
    }
  }, [showSwitchTabs])

  /** 注册一个全局事件来触发 loading, 因为有些场景不能用 hook */
  useEffect(() => {
    function setLoading() {
      setEventLoading(true)
    }
    function setUnLoading() {
      setEventLoading(false)
    }
    document.addEventListener('loading', setLoading)
    document.addEventListener('unloading', setUnLoading)

    return () => {
      document.removeEventListener('loading', setLoading)
      document.removeEventListener('unloading', setUnLoading)
    }
  }, [])

  return (
    <Layout style={{ height: '100vh' }} className="business-layout">
      <Header>
        <Navbar />
      </Header>
      <Layout>
        <Sider
          breakpoint="md"
          collapsedWidth={50}
          width={compactMode === 'compact' ? 180 : 220}
          theme="light"
          style={{
            overflow: 'auto',
            boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)',
          }}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          trigger={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        >
          <RouteMenu collapsed={collapsed} />
        </Sider>
        <Layout className="business-layout-right">
          <div
            className={`business-layout-loading ${loading || eventLoading ? 'business-layout-loading-show' : ''}`}
          >
            <Spin />
          </div>
          {showSwitchTabs && (
            <div style={{ padding: '0 24px' }}>
              <SwitchTabs menus={initialState.menuDataSource} />
            </div>
          )}

          <RouteBread />
          <div className="business-layout-scroll-part">
            <Content
              style={{
                minHeight: 280,
              }}
            >
              <BusinessContent />
            </Content>
            <Footer style={{ textAlign: 'center', marginBottom: '34px' }}>
              ©{new Date().getFullYear()} 国联
            </Footer>
          </div>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default BusinessLayout
