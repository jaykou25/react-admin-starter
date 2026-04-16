import { useEffect } from 'react'
import { Helmet, useAppData, useLocation, useModel } from 'umi'
import {
  ConfigProvider,
  theme,
  Upload,
  Modal,
  App,
  message,
  notification,
} from 'antd'
import BusinessLayout from './businessLayout'
import { SettingProvider } from 'react-admin-kit'
import {
  ls,
  SETTING_KEY,
  getToken,
  inWhiteList,
  getWhiteListLayout,
  useQuery,
  findTree,
  SITE,
  setGlobalMessageApi,
  setGlobalNotificationApi,
} from '@/utils'

import zhCN from 'antd/locale/zh_CN'

export default function Layout() {
  const { pathname } = useLocation()
  const { basename } = useAppData()
  const { initialState } = useModel('@@initialState')
  const { menuDataSource } = initialState
  const { breadName } = useQuery()
  const [messageApi, contextHolder] = message.useMessage()
  const [notificationApi, notificationContextHolder] =
    notification.useNotification()
  const [modalApi, modalContextHolder] = Modal.useModal()

  window.base = basename

  console.log('Layout组件日志')

  useEffect(() => {
    setGlobalMessageApi(messageApi)
    setGlobalNotificationApi(notificationApi)
  }, [])

  const targetMenu = findTree(
    menuDataSource,
    (item) => item.routeUrl === pathname
  )

  const titleArr = [SITE.name]
  if (targetMenu && pathname !== '/') {
    titleArr.push(breadName || targetMenu.name)
  }

  const getLayout = () => {
    if (inWhiteList(pathname)) {
      return getWhiteListLayout(pathname)
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
      <App>
        {modalContextHolder}
        {contextHolder}
        {notificationContextHolder}
        <SettingProvider
          proTableSetting={{
            size: tableSize,
            delConfirmType: 'modal',
            pagination: { pageSize: 10 },
            options: { density: false, reload: true, fullScreen: true },
            scroll: {
              x: 'max-content',
            },
          }}
          formUploadSetting={{
            action: '/api/accessory/upload',
            headers: { token: getToken() || '' },
            responseToFileList: (res) => {
              console.log(res)
              return res.data
            },
            urlKey: 'downloadUrl',
            nameKey: 'accName',

            beforeUpload: (file) => {
              // 限制20M
              const isFile20M = file.size / 1024 / 1024 > 20
              if (isFile20M) {
                messageApi.warning(`${file.name}大小超出20M，请修改后重新上传`)
                return Upload.LIST_IGNORE
              }
              return true
            },
            onRemove: () => {
              return new Promise((resolve) => {
                modalApi.confirm({
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
            centered: true,
            mask: {
              closable: false,
            },
          }}
        >
          <Helmet>
            <title>{titleArr.join('-')}</title>
          </Helmet>

          {getLayout()}
        </SettingProvider>
      </App>
    </ConfigProvider>
  )
}
