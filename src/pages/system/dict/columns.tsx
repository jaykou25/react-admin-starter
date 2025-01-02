import { Badge } from 'antd'
import BooleanSelect from '@/components/BooleanSelect'
import BooleanRadioGroup from '@/components/BooleanRadioGroup'
import type { TableColumnType } from 'react-admin-kit'
import { LinkButton } from 'react-admin-kit'
import { hasPermission } from '@/utils'

export const getDictColumns = (): TableColumnType[] => {
  return [
    // 仅用于搜索, 不展示
    {
      title: '名称/描述',
      dataIndex: 'name',
      hideInTable: true,
      hideInForm: true,
      fieldProps: {
        placeholder: '输入名称或描述搜索',
      },
    },
    { title: '序号', valueType: 'index', width: 60 },
    {
      title: '名称',
      dataIndex: 'name',
      copyable: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '名称为必填项',
          },
        ],
      },
      search: false,
      width: 210,
    },
    {
      title: '描述',
      dataIndex: 'remark',
      // ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: false,
            message: '描述为必填项',
          },
        ],
      },
      search: false,
      width: 210,
    },

    {
      title: '状态',
      dataIndex: 'deleted',
      width: 80,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '状态为必填项',
          },
        ],
      },
      initialValue: 0,
      renderFormItem: (_, { type }) => {
        if (type === 'form') {
          return (
            <BooleanRadioGroup
              yesValue={0}
              noValue={1}
              yesText="开启"
              noText="关闭"
            />
          )
        }

        return (
          <BooleanSelect
            yesValue={0}
            noValue={1}
            yesText="开启"
            noText="关闭"
          />
        )
      },
      render: (text, record) => {
        if (record.deleted) {
          return <Badge status="error" text="关闭" />
        }
        return <Badge status="processing" text="开启" />
      },
    },

    {
      title: '操作',
      valueType: 'option',
      width: 100,
      ellipsis: true,
      dataIndex: 'option',
      enableDelete: true,
      render: (_, record, index, actionRef, innerRef) => [
        <LinkButton
          key={1}
          visible={() => hasPermission('dict:edit')}
          onClick={(e) => {
            e.stopPropagation()
            innerRef.current?.openModal('edit', record)
          }}
        >
          编辑
        </LinkButton>,
      ],
    },
  ]
}
