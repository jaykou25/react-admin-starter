import type { MenuProps } from 'antd'
import { Dropdown } from 'antd'

const DropdownMenu: React.FC<any> = ({
  open,
  pos,
  handleNew,
  recordRef,
  handleEdit,
  handleBtnAssetsClick,
  handleCacheToggle,
  handleShowToggle,
}) => {
  const getItems = (): MenuProps['items'] => {
    return [
      {
        key: 'add',
        label: '新增',
      },
      {
        key: 'edit',
        label: '编辑',
      },
      {
        key: 'btnAssets',
        label: '按钮资源',
      },
      {
        key: 'd',
        type: 'divider',
      },
      {
        key: 'showToggle',
        label: recordRef.current?.isShow ? '隐藏菜单' : '显示菜单',
      },
      {
        key: 'cacheToggle',
        label: recordRef.current?.isCache ? '取消缓存' : '缓存页面',
      },
    ]
  }
  return (
    <Dropdown
      transitionName=""
      menu={{
        items: getItems(),
        onClick: ({ key }) => {
          if (key === 'add') {
            handleNew(recordRef.current)
          }

          if (key === 'edit') {
            handleEdit(recordRef.current)
          }

          if (key === 'btnAssets') {
            handleBtnAssetsClick(recordRef.current)
          }

          if (key === 'showToggle') {
            handleShowToggle(recordRef.current)
          }

          if (key === 'cacheToggle') {
            handleCacheToggle(recordRef.current)
          }
        },
      }}
      open={open}
      overlayStyle={{ left: `${pos.x}px`, top: `${pos.y}px` }}
    />
  )
}

export default DropdownMenu
