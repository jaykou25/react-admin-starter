import { Badge } from 'antd'
import BooleanRadioGroup from '@/components/BooleanRadioGroup'
import type { TableColumnType } from 'react-admin-kit'

export const getDictDetailColumns = (): TableColumnType[] => {
  return [
    {
      title: '序号',
      valueType: 'index',
      width: 60,
    },
    {
      title: '字典标签',
      dataIndex: 'label',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '必填项',
          },
        ],
      },
      search: false,
      width: 150,
    },
    {
      title: '字典值',
      dataIndex: 'value',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '必填项',
          },
        ],
      },
      search: false,
      width: 70,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      valueType: 'digit',
      fieldProps: { style: { width: '100%' } },
      initialValue: 10,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '必填项',
          },
        ],
      },
      search: false,
      width: 70,
    },
    // {
    //   title: '状态',
    //   dataIndex: 'enabled',
    //   width: 70,
    //   formItemProps: {
    //     rules: [
    //       {
    //         required: true,
    //         message: '状态为必填项',
    //       },
    //     ],
    //   },
    //   renderFormItem: () => {
    //     return <BooleanRadioGroup yesText="开启" noText="关闭" />
    //   },
    //   render: (text) => {
    //     if (text) {
    //       return <Badge status="processing" text="开启" />
    //     }
    //     return <Badge status="error" text="关闭" />
    //   },
    // },

    {
      title: '操作',
      fixed: 'right',
      valueType: 'option',
      search: false,
      width: 100,
      ellipsis: true,
      dataIndex: 'option',
      enableDelete: true,
      render: (_, record, index, actionRef, innerRef) => [
        <a onClick={() => innerRef.current?.openModal('edit', record)}>编辑</a>,
      ],
    },
  ]
}
