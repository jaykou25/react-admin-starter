import { SettingOutlined, ReadOutlined } from '@ant-design/icons'
import AvatarDropdown from '../AvatarDropdown'
import BadgeDropdown from '../BadgeDropdown'
import styles from './index.less'
import Logo from '@/assets/guolian-logo.png'
import { ConfigProvider, Drawer, Menu } from 'antd'
import { useEffect, useState } from 'react'
import { SchemaForm } from 'react-admin-kit'
import { ls } from '@/utils'
import { SETTING_KEY } from '@/utils/constants'
import { useModel, history } from 'umi'
import { getMenusFromData } from '../../utils/menu'

const Navbar = () => {
  const { initialState, setInitialState } = useModel('@@initialState')

  const { firstLevelMenus, iconfontUrl, activeFirstLevelMenuKey } = initialState
  const items = getMenusFromData(firstLevelMenus, {
    iconfontUrl,
  })

  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState(activeFirstLevelMenuKey)
  const { render } = useModel('render')

  useEffect(() => {
    setCurrent(activeFirstLevelMenuKey)
  }, [activeFirstLevelMenuKey])

  const onMenuClick = (e) => {
    setCurrent(e.key)
    setInitialState({ ...initialState, activeFirstLevelMenuKey: e.key })

    const hasSubMenu = firstLevelMenus.find(
      (item) => item.routeUrl === e.key
    )?.hasSubMenu

    if (!hasSubMenu) {
      history.push(e.key)
    }
  }

  // 点击操作指南
  const onClickGuide = () => {
    window.open(
      'http://10.10.10.80/static/pdf/国联安全生产管理平台使用操作指南参考版V1.0.pdf'
    )
  }

  return (
    <div className={styles.navbar}>
      <div className={styles.left}>
        <div className={styles.logo} onClick={() => history.push('/')}>
          <img style={{ marginTop: '1px' }} height="30px" src={Logo} />
          <div className={styles['logo-name']}>安全生产管理平台</div>
        </div>
      </div>
      <div className={styles.middle}>
        <ConfigProvider
          theme={{
            components: {
              Menu: {
                itemColor: '#add8ff',
                itemHoverColor: '#fff',
                horizontalItemSelectedColor: '#fff',
              },
            },
          }}
        >
          <Menu
            mode="horizontal"
            items={items}
            selectedKeys={[current]}
            onClick={onMenuClick}
          />
        </ConfigProvider>
      </div>
      <div className={styles.right}>
        {/* 头像 */}
        <AvatarDropdown />
        {/* <BadgeDropdown /> */}
        {/* 设置 */}
        <SettingOutlined
          onClick={() => setOpen((val) => !val)}
          style={{ marginLeft: '8px', cursor: 'pointer' }}
        />
        {/* 操作指南 */}
        <div className={styles.guide} onClick={onClickGuide}>
          <ReadOutlined style={{ fontSize: '15px' }} />
          <span className={styles.guideText}>指南</span>
        </div>
      </div>
      <Drawer
        title="页面设置"
        width={280}
        open={open}
        onClose={() => setOpen(false)}
      >
        <SchemaForm
          onValuesChange={(val, allVals) => {
            ls.set(SETTING_KEY, allVals)
            render()
          }}
          initialValues={
            ls.get(SETTING_KEY)
              ? ls.get(SETTING_KEY)
              : { compactMode: 'default', tableSize: 'small' }
          }
          layout="horizontal"
          columns={[
            {
              title: '多页签',
              dataIndex: 'showSwitchTabs',
              valueType: 'switch',
            },
            {
              title: '宽松度',
              dataIndex: 'compactMode',
              valueType: 'radio',
              fieldProps: {
                options: [
                  { label: '默认', value: 'default' },
                  { label: '紧凑', value: 'compact' },
                ],
              },
            },
            {
              title: '表格大小',
              dataIndex: 'tableSize',
              valueType: 'select',
              fieldProps: {
                options: [
                  { label: '小', value: 'small' },
                  { label: '默认', value: 'middle' },
                  { label: '大', value: 'default' },
                ],
              },
            },
          ]}
        />
      </Drawer>
    </div>
  )
}

export default Navbar
