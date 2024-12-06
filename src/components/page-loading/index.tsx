import BgSrc from '@/assets/home_bg.png'
import styles from './styles.less'

// loading components from code split
// https://umijs.org/plugin/umi-plugin-react.html#dynamicimport
function PageLoading(props: { transparent?: Boolean }) {
  const { transparent } = props
  return (
    <div
      className={`${styles.main} ${transparent && styles.mainTransparent}`}
      style={{ backgroundImage: `url(${BgSrc})` }}
    >
      <span className={styles.loadingIcon} />
    </div>
  )
}
export default PageLoading
