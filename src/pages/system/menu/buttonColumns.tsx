import { LinkButton } from 'react-admin-kit'
import type { TableColumnType } from 'react-admin-kit'

export const getButtonColumns = (options?: any): TableColumnType[] => {
  const { selectedMenu } = options || {}
  const cols: TableColumnType[] = [
    {
      title: '父菜单名称',
      hideInTable: true,
      dataIndex: 'fatherMenuName',
      fieldProps: {
        disabled: true,
      },
    },

    {
      title: '按钮名称',
      dataIndex: 'name',
      ellipsis: false,
      width: '100',
      formItemProps: { required: true },
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 70,
    },
    {
      title: '权限标识',
      dataIndex: 'code',
      copyable: true,
      width: 190,
      ellipsis: false,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
      ellipsis: false,
      enableDelete: true,
      render: (_, record, index, actionRef, innerRef) => [
        <LinkButton
          key={1}
          onClick={() => {
            innerRef.current?.openModal('edit', {
              ...record,
              fatherMenuName: selectedMenu.name,
            })
          }}
        >
          编辑
        </LinkButton>,
      ],
    },
  ]

  return cols.map((col) => {
    const $col = { ...col }

    if (col.ellipsis === undefined) $col.ellipsis = true

    return $col
  })
}
