import styles from './styles.less'

// loading components from code split
// https://umijs.org/plugin/umi-plugin-react.html#dynamicimport
function PageLoading(props: { transparent?: Boolean }) {
  const { transparent } = props
  return (
    <div className={`${styles.main} ${transparent && styles.mainTransparent}`}>
      <span className={styles.loadingIcon} />
    </div>
  )
}
export default PageLoading
