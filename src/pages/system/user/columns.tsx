import BusinessSelect from '@/components/BusinessSelect'
import { Badge, Input, Tag } from 'antd'
import BooleanRadioGroup from '@/components/BooleanRadioGroup'
import BooleanSelect from '@/components/BooleanSelect'
import type { TableColumnType } from 'react-admin-kit'
import { LinkButton } from 'react-admin-kit'
import { hasPermission } from '@/utils'
import BusinessTreeSelect from '@/components/BusinessTreeSelect'

export const getColumns = (): TableColumnType[] => {
  const cols: TableColumnType[] = [
    {
      title: '序号',
      valueType: 'index',
      width: 48,
      fixed: 'left',
    },

    {
      // 用于搜索
      title: '用户名/昵称/手机号',
      dataIndex: 'keyword',
      hideInTable: true,
      hideInForm: true,
      copyable: true,
      width: 120,
      fieldProps: { placeholder: '输入关键字查询' },
    },
    {
      title: '用户名',
      copyable: true,
      dataIndex: 'username',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '用户名为必填项',
          },
        ],
      },
      search: false,
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
      search: false,
      width: 130,
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      copyable: true,
      search: false,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '昵称为必填项',
          },
        ],
      },
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
      search: false,
    },

    {
      title: '邮箱',
      width: 120,
      ellipsis: true,
      copyable: true,
      dataIndex: 'email',
      search: false,
    },
    // {
    //   // 仅用于搜索
    //   title: '所属公司',
    //   type: 'table',
    //   hideInTable: true,
    //   dataIndex: ['orgId'],
    //   width: 120,
    //   renderFormItem: () => <BusinessTreeSelect type="companyTree" />,
    // },

    // {
    //   title: '所属公司',
    //   search: false,
    //   dataIndex: ['userInfo', 'companyId'],
    //   width: 120,
    //   renderFormItem: () => <BusinessSelect type="orgCompany" />,
    //   renderText: (text, record) => {
    //     return record.userInfo?.companyName
    //   },
    // },
    {
      title: '所属部门',
      dataIndex: ['userInfo', 'orgId'],
      search: false,
      width: 260,
      ellipsis: true,
      hideInForm: true,
      renderText: (text, record) => record.userInfo?.orgName,
    },
    {
      // 仅用于搜索
      title: '角色',
      type: 'table',
      hideInTable: true,
      dataIndex: 'roleIds',
      renderFormItem: () => {
        return <BusinessSelect mode="multiple" type="role" />
      },
      transform: (val) => {
        return val.join(',')
      },
    },

    {
      title: '角色',
      dataIndex: 'roleIds',
      width: 120,
      search: false,
      renderFormItem: (_, { type, defaultRender }) => {
        if (type === 'form') {
          return <BusinessSelect mode="multiple" type="role" />
        }
        return defaultRender(_)
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
    // {
    //   title: '密码',
    //   dataIndex: 'password',
    //   valueType: 'password',
    //   type: 'form',
    // },
    {
      title: '启用状态',
      dataIndex: 'status',
      width: 80,
      initialValue: 1,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '状态为必填项',
          },
        ],
      },
      renderFormItem: (_, { type }) => {
        if (type === 'form') {
          return <BooleanRadioGroup yesText="开启" noText="关闭" />
        }

        return (
          <BooleanSelect yesText="开启" noText="关闭" placeholder="请选择" />
        )
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
      search: false,
      width: 100,
    },
    // {
    //   title: '创建日期',
    //   dataIndex: 'createTime',
    //   valueType: 'dateRange',
    //   hideInForm: true,
    //   hideInTable: true,
    //   width: 100,
    //   search: {
    //     transform: (value) => {
    //       return {
    //         createTime: [`${value[0]} 00:00:00`, `${value[1]} 23:59:59`],
    //       }
    //     },
    //   },
    //   colSize: 1,
    // },
    {
      title: '操作',
      fixed: 'right',
      align: 'center',
      valueType: 'option',
      width: 110,
      ellipsis: true,
      enableDelete: true,
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

  return cols.map((col) => ({
    ...col,
    align: col.align || 'center',
  }))
}
