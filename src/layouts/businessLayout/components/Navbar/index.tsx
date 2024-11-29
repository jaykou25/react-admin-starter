import { SettingOutlined, ReadOutlined } from '@ant-design/icons'
import AvatarDropdown from '../AvatarDropdown'
import styles from './index.less'
import Logo from '@/assets/guolian-logo.png'
import { Drawer } from 'antd'
import { useState } from 'react'
import { SchemaForm } from 'react-admin-kit'
import { ls } from '@/utils'
import { SETTING_KEY } from '@/utils/constants'
import { useModel, history } from 'umi'

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const { render } = useModel('render')

  return (
    <div className={styles.navbar}>
      <div className={styles.left}>
        <div className={styles.logo} onClick={() => history.push('/')}>
          <img style={{ marginTop: '1px' }} height="30px" src={Logo} />
          <div className={styles['logo-name']}>REACT ADMIN STARTER</div>
        </div>
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
