import type { FormColumnType } from 'react-admin-kit'
import BusinessTreeSelect from '@/components/BusinessTreeSelect'

export const getRoleColumns = (): FormColumnType[] => {
  return [
    {
      title: '角色名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [
          {
            required: true,
          },
        ],
      },
    },
    {
      title: '角色编码',
      dataIndex: 'code',
    },
    {
      title: '数据权限',
      dataIndex: 'scopeSeq',
      valueType: 'select',
      fieldProps: {
        options: [
          { label: '全部数据权限', value: 1 },
          { label: '自定数据权限', value: 2 },
          { label: '部门数据权限', value: 3 },
          { label: '部门及以下数据权限', value: 4 },
          { label: '仅本人数据权限', value: 5 },
        ],
      },
    },
    {
      valueType: 'dependency',
      name: ['scopeSeq'],
      columns: ({ scopeSeq }) => {
        if (scopeSeq === 2) {
          return [
            {
              title: '自定数据权限',
              dataIndex: 'scopeOrgIds',
              required: true,
              renderFormItem: () => (
                <BusinessTreeSelect multiple type="deptTree" />
              ),
              // 回显
              convertValue: (val) => {
                if (!val) return []

                if (Array.isArray(val)) {
                  return val
                }
                return val.split(',').map((item) => +item)
              },
              // 提交
              transform: (ids) => {
                if (Array.isArray(ids)) {
                  return { scopeOrgIds: ids.join(',') }
                }
                return { scopeOrgIds: ids }
              },
            },
          ]
        }

        return []
      },
    },
    {
      title: '角色状态',
      dataIndex: 'status',
      valueType: 'radio',
      initialValue: 1,
      fieldProps: {
        options: [
          { label: '开启', value: 1 },
          { label: '禁用', value: 0 },
        ],
      },
    },

    {
      title: '描述信息',
      dataIndex: 'remark',
      valueType: 'textarea',
      formItemProps: {
        rules: [
          {
            required: false,
            message: '描述为必填项',
          },
        ],
      },
    },
  ]
}
