import type { TableColumnType } from 'react-admin-kit'
import { LinkButton } from 'react-admin-kit'
import { Space, Tooltip } from 'antd'
import IconFont from '@/components/icon-font'

export const getColumns = ({
  setOpen,
  setSelectedMenu,
}: any = {}): TableColumnType[] => {
  return [
    {
      title: '菜单标题',
      dataIndex: 'name',
      width: 300,
      renderText: (text, record) => (
        <Space
          style={{
            marginLeft: '3px',
            color: record.isShow ? 'inherit' : '#888',
          }}
        >
          {!!record.icon && <IconFont type={record.icon} />}
          {text}
          {!!record.isCache && (
            <Tooltip title="页面已缓存">
              <span>
                <IconFont type="icon-huancunbold" />
              </span>
            </Tooltip>
          )}
        </Space>
      ),
    },
    { title: '路由地址', dataIndex: 'routeUrl', width: 350, copyable: true },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 60,
      align: 'center',
      initialValue: 10,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 220,
      fixed: 'right',
      enableDelete: () => ({ visible: true, danger: true }),
      render: (text, record, index, actionRef, innerRef) => [
        <LinkButton
          key={1}
          onClick={(e) => {
            e.stopPropagation()
            innerRef.current?.openModal('new', {
              parentId: record.id,
              routeUrl: record.routeUrl,
              sort: record.children ? (record.children.length + 1) * 10 : 1,
            })
          }}
        >
          新增
        </LinkButton>,
        <LinkButton
          key={2}
          onClick={(e) => {
            e.stopPropagation()
            innerRef.current?.openModal('edit', record)
          }}
        >
          编辑
        </LinkButton>,
        <LinkButton
          key={3}
          onClick={(e) => {
            e.stopPropagation()
            setSelectedMenu(record)
            setOpen(true)
          }}
        >
          按钮资源
        </LinkButton>,
      ],
    },
  ]
}
