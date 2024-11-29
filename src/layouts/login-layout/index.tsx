import { Outlet } from 'umi'
import styles from './styles.less'

const LoginLayout = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Outlet />
      </div>
      {/* <DefaultFooter
        copyright={`${new Date().getFullYear()} 无锡地铁集团`}
        links={[]}
      /> */}
    </div>
  )
}

export default LoginLayout
