import { useLocation, useModel } from 'umi'
import { Breadcrumb } from 'antd'
import { useQuery } from '@/utils'
import { getBreadItems } from '@/utils/menuUtil'

/**
 * 根据当前面页面的路径展示面包屑
 */
const RouteBread = () => {
  const { breadName } = useQuery()

  const { pathname } = useLocation()

  const { initialState } = useModel('@@initialState')

  return (
    <Breadcrumb
      style={{ margin: '16px 24px' }}
      items={getBreadItems(initialState.menuDataSource, pathname, {
        leafBreadName: breadName,
      })}
    />
  )
}

export default RouteBread
