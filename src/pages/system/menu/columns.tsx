import type { TableColumnType } from 'react-admin-kit'
import { LinkButton } from 'react-admin-kit'
import { Tag } from 'antd'

export const getColumns = ({
  setOpen,
  setSelectedMenu,
} = {}): TableColumnType[] => {
  return [
    { title: '序号', valueType: 'index', width: 110 },
    {
      title: '菜单标题',
      dataIndex: 'name',
    },
    { title: '路由地址', dataIndex: 'routeUrl', width: 160, copyable: true },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 60,
      align: 'center',
      initialValue: 10,
    },
    {
      title: '显示状态',
      dataIndex: 'isShow',
      align: 'center',
      width: 100,
      render: (text) => {
        if (!text) {
          return (
            <Tag style={{ marginRight: '0' }} color="#108ee9">
              已隐藏
            </Tag>
          )
        }

        return <span style={{ fontSize: '12px' }}>正常</span>
      },
    },
    {
      title: '缓存状态',
      dataIndex: 'isCache',
      align: 'center',
      width: 100,
      render: (text) => {
        if (text) {
          return (
            <Tag style={{ marginRight: '0' }} color="#108ee9">
              已缓存
            </Tag>
          )
        }

        return <span style={{ fontSize: '12px' }}>否</span>
      },
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
