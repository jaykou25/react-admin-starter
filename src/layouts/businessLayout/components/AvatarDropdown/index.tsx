import { clearToken } from '@/utils/auth'
import { LogoutOutlined, SettingOutlined } from '@ant-design/icons'
import { Avatar, Dropdown, Spin } from 'antd'
import { history, useModel } from 'umi'
import styles from './index.less'
import { clearSelectCache, clearTreeSelectCache } from 'react-admin-kit'

const defaultAvatarSrc =
  'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'

const AvatarDropdown = () => {
  const { initialState } = useModel('@@initialState')
  const { currentUser } = initialState
  const midInfo = sessionStorage.getItem('backupUserInfo')
  const backupUserInfo = midInfo ? JSON.parse(midInfo) : {}
  const userInfo = currentUser || backupUserInfo
  const onMenuClick = (event) => {
    const { key } = event

    if (key === 'logout') {
      handleLogout()

      return
    }

    if (key === 'password') {
      history.push('/account/password')
      return
    }
  }

  const handleLogout = () => {
    // 清除token
    clearToken()
    clearSelectCache()
    clearTreeSelectCache()

    history.replace('/login')
  }

  return userInfo?.nickname ? (
    <Dropdown
      menu={{
        items: [
          {
            key: 'password',
            label: '修改密码',
            icon: <SettingOutlined />,
          },
          {
            key: 'logout',
            label: '退出登录',
            icon: <LogoutOutlined />,
          },
        ],
        onClick: onMenuClick,
      }}
      placement="bottomRight"
    >
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar
          size="small"
          className={styles.avatar}
          src={userInfo.head ? userInfo.head : defaultAvatarSrc}
          alt="avatar"
        />
        <span className={`${styles.name} anticon`}>{userInfo.nickname}</span>
      </span>
    </Dropdown>
  ) : (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  )
}

export default AvatarDropdown
