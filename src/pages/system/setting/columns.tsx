import { LinkButton } from 'react-admin-kit'
import type { TableColumnType } from 'react-admin-kit'

export const getColumns = (options: any = {}): TableColumnType[] => {
  const {} = options
  const cols: TableColumnType[] = [
    {
      title: '序号',
      valueType: 'index',
      width: 60,
    },
    {
      title: '参数键名',
      dataIndex: 'key',
      width: 160,
      formItemProps: {
        rules: [{ required: true }],
      },
    },
    {
      title: '参数键值',
      dataIndex: 'value',
      hideInSearch: true,
      width: 220,
      formItemProps: {
        rules: [{ required: true }],
      },
    },
    {
      title: '说明',
      hideInSearch: true,
      dataIndex: 'description',
      width: 180,
    },
    {
      title: '操作',
      valueType: 'option',
      ellipsis: true,
      fixed: 'right',
      width: 100,
      enableDelete: () => ({ danger: true, visible: window._isAdmin }),
      render: (text, record, index, actionRef, innerRef) => [
        <LinkButton
          key={1}
          onClick={() => innerRef.current?.openModal('edit', record)}
          visible={window._isAdmin}
        >
          编辑
        </LinkButton>,
      ],
    },
  ]

  return cols.map((col) => {
    const $col = { ...col }
    if (!col.width) $col.width = 100

    $col.ellipsis = true

    return $col
  })
}
