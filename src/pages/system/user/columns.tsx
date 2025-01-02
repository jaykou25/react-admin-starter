import BusinessSelect from '@/components/BusinessSelect'
import { Badge, Tag } from 'antd'
import BooleanRadioGroup from '@/components/BooleanRadioGroup'
import BooleanSelect from '@/components/BooleanSelect'
import type { TableColumnType } from 'react-admin-kit'
import { LinkButton } from 'react-admin-kit'
import { hasPermission } from '@/utils'

export const getColumns = (): TableColumnType[] => {
  // 用于搜索
  const searchCols: TableColumnType[] = [
    {
      title: '用户名/昵称/手机号',
      dataIndex: 'keyword',
      type: 'search',
      fieldProps: { placeholder: '输入关键字查询' },
    },
    {
      title: '角色',
      type: 'search',
      dataIndex: 'roleIds',
      renderFormItem: () => {
        return <BusinessSelect mode="multiple" type="role" />
      },
      transform: (val) => {
        return val.join(',')
      },
    },
    {
      title: '启用状态',
      dataIndex: 'status',
      type: 'search',
      initialValue: 1,
      renderFormItem: (_) => {
        return (
          <BooleanSelect yesText="开启" noText="关闭" placeholder="请选择" />
        )
      },
    },
  ]

  const cols: TableColumnType[] = [
    {
      title: '序号',
      valueType: 'index',
      width: 48,
      fixed: 'left',
    },
    {
      title: '用户名',
      copyable: true,
      dataIndex: 'username',
      required: true,
      width: 120,
      fixed: 'left',
    },
    {
      title: '电话',
      type: 'form',
      dataIndex: 'phone',
      required: true,
    },
    {
      title: '电话',
      type: 'table',
      dataIndex: 'phoneEncode',
      width: 130,
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      copyable: true,
      required: true,
      width: 120,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      valueType: 'radio',
      fieldProps: {
        options: [
          { label: '男', value: 1 },
          { label: '女', value: 0 },
        ],
      },
      width: 80,
    },
    {
      title: '邮箱',
      width: 120,
      ellipsis: true,
      copyable: true,
      dataIndex: 'email',
    },
    {
      title: '所属部门',
      dataIndex: ['userInfo', 'orgId'],
      width: 260,
      ellipsis: true,
      hideInForm: true,
      renderText: (text, record) => record.userInfo?.orgName,
    },
    {
      title: '角色',
      dataIndex: 'roleIds',
      width: 120,
      search: false,
      renderFormItem: (_, { type, defaultRender }) => {
        return <BusinessSelect mode="multiple" type="role" />
      },
      render: (text, record) => {
        return (
          <div>
            {(record.roleList || []).map((role) => (
              <Tag key={role.id} title={role.name}>
                {role.name}
              </Tag>
            ))}
          </div>
        )
      },
    },
    {
      title: '启用状态',
      dataIndex: 'status',
      width: 80,
      initialValue: 1,
      required: true,
      renderFormItem: (_, { type }) => {
        return <BooleanRadioGroup yesText="开启" noText="关闭" />
      },
      render: (text) => {
        if (text) {
          return <Badge status="processing" text="开启" />
        }
        return <Badge status="error" text="关闭" />
      },
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      valueType: 'date',
      hideInForm: true,
      width: 100,
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'center',
      valueType: 'option',
      width: 110,
      ellipsis: true,
      enableDelete: () => ({ danger: true }),
      render: (_, record, index, action, innerRef) => [
        <LinkButton
          visible={() => hasPermission('user:edit')}
          key={1}
          onClick={() =>
            innerRef.current?.openModal('edit', {
              ...record,
              roleIds: (record.roleList || []).map((role) => role.id),
            })
          }
        >
          编辑
        </LinkButton>,
      ],
    },
  ]

  return searchCols.concat(cols).map((col) => ({
    ...col,
    align: col.align || 'center',
  }))
}
