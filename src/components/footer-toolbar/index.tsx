import { useModel } from 'umi'
import { SETTING_KEY } from '@/utils/constants'
import { ls } from '@/utils'
const { compactMode } = ls.get(SETTING_KEY) || {}
import styles from './index.less'

const FooterToobar = (props) => {
  const { collapsed } = useModel('collapsed')
  const width = compactMode === 'compact' ? 180 : 220
  return (
    <div
      className={styles.main}
      style={{
        justifyContent: 'center',
        width: collapsed ? 'calc(100% - 50px)' : `calc(100% - ${width}px)`,
      }}
    >
      {props.children}
    </div>
  )
}

export default FooterToobar
