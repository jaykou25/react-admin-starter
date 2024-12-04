import { useEffect, useState } from 'react'
import { Layout, theme, Spin, Image } from 'antd'

import Navbar from './components/Navbar'
import RouteBread from './components/RouteBread'
import RouteMenu from './components/RouteMenu'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { useModel } from 'umi'
import { SETTING_KEY, ls } from '@/utils'

import './styles.less'
import BusinessContent from '@/components/business-content'

const { Header, Content, Sider, Footer } = Layout

const BusinessLayout = () => {
  const { initialState } = useModel('@@initialState')
  const { renderKey } = useModel('render')
  const { collapsed, setCollapsed } = useModel('collapsed')
  const { loading } = useModel('loading')
  const [eventLoading, setEventLoading] = useState(false)

  const { showSwitchTabs, compactMode } = ls.get(SETTING_KEY) || {}

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
    <Layout style={{ height: '100vh' }}>
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
        <Layout id="contentLayout">
          {showSwitchTabs && (
            <div style={{ padding: '0 24px' }}>
              {/* <SwitchTabs menus={initialState.menuDataSource} /> */}
            </div>
          )}

          <Spin
            wrapperClassName="spinWrapper"
            spinning={loading || eventLoading}
          >
            <div className="basicLayoutMain">
              <Layout>
                <RouteBread />
                <Content
                  style={{
                    margin: 0,
                    minHeight: 280,
                  }}
                >
                  <BusinessContent />
                </Content>
                <Footer style={{ textAlign: 'center', marginBottom: '34px' }}>
                  ©2024 国联
                </Footer>
              </Layout>
            </div>
          </Spin>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default BusinessLayout
