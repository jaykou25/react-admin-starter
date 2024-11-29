import { useLocation, Outlet } from 'umi'
import { ConfigProvider, theme, message, Upload, Modal } from 'antd'
import BusinessLayout from './businessLayout'
import { SettingProvider } from 'react-admin-kit'
import { ls, SETTING_KEY, getToken } from '@/utils'

import zhCN from 'antd/locale/zh_CN'
import LoginLayout from './login-layout'

export default function Layout() {
  const { pathname } = useLocation()

  const getLayout = () => {
    // sso
    if (/^\/sso/.test(pathname)) {
      return <Outlet />
    }

    // 登陆页面
    if (/^\/login/.test(pathname)) {
      return <LoginLayout />
    }

    // 正常业务页面
    return <BusinessLayout />
  }

  const { compactMode, tableSize = 'small' } = ls.get(SETTING_KEY) || {}

  const algorithms = [theme.defaultAlgorithm]

  if (compactMode === 'compact') {
    algorithms.push(theme.compactAlgorithm)
  }

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: algorithms,
        components: {
          Layout: {
            bodyBg: 'hsl(0, 0%, 94%)',
            footerBg: 'hsl(0, 0%, 94%)',
            headerBg: '#0958d9', // blue-7
            headerColor: '#fff',
            headerHeight: 48,
            headerPadding: 0,
          },
          Menu: {
            iconSize: 15,
            collapsedIconSize: 17,
          },
          Table: {
            rowHoverBg: 'hsl(0, 0%, 90%)',
          },
        },
      }}
    >
      <SettingProvider
        proTableSetting={{
          size: tableSize,
          confirmModalType: 'modal',
          options: { density: false, reload: true, fullScreen: true },
        }}
        formUploadSetting={{
          action: '/api/main/accessory/upload',
          headers: { token: getToken() || '' },
          responseToFileList: (res) => {
            console.log(res)
            return res.data
          },
          urlKey: 'downloadUrl',
          nameKey: 'accName',
          beforeUpload: (file) => {
            // 限制50M
            const isFile50M = file.size / 1024 / 1024 > 20
            if (isFile50M) {
              message.warning(`${file.name}大小超出20M，请修改后重新上传`)
              return Upload.LIST_IGNORE
            }
            return true
          },
          onRemove: () => {
            return new Promise((resolve) => {
              Modal.confirm({
                title: '确定删除吗?',
                onOk: () => {
                  resolve(true)
                },
                onCancel: () => {
                  resolve(false)
                },
              })
            })
          },
        }}
        modalFormSetting={{
          modalProps: {
            maskClosable: false,
          },
        }}
      >
        {getLayout()}
      </SettingProvider>
    </ConfigProvider>
  )
}
