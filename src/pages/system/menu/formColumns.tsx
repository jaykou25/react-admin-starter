import BooleanRadioGroup from '@/components/BooleanRadioGroup'
import BusinessTreeSelect from '@/components/BusinessTreeSelect'
import CopyableInput from '@/components/CopyableInput'
import type { FormColumnType } from 'react-admin-kit'

export const getFormColumns = (options?: any): FormColumnType[] => {
  return [
    {
      title: '父级节点',
      dataIndex: 'parentId',
      fieldProps: {
        placeholder: '顶级菜单',
        // disabled: true,
      },
      renderFormItem: () => {
        return <BusinessTreeSelect type="menu" />
      },
    },
    {
      title: '菜单图标',
      formItemProps: {},
      dataIndex: 'icon',
      tooltip:
        '菜单图标填入iconfont的图标名称, 注意要带上icon前缀. 例: icon-system',
    },
    {
      title: '菜单标题',
      dataIndex: 'name',
      formItemProps: { rules: [{ required: true }] },
      renderFormItem: () => <CopyableInput />,
    },
    {
      title: '路由地址',
      dataIndex: 'routeUrl',
      formItemProps: {
        rules: [{ required: true }],
      },
      tooltip:
        '路由地址应填入一个匹配页面的完整路由. 以当前路由为例应填入: /system/menu',
      renderFormItem: () => <CopyableInput />,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      valueType: 'digit',
      tooltip: '排序的数字越小越靠前',
      initialValue: 1,
    },
    {
      title: '菜单是否展示',
      dataIndex: 'isShow',
      initialValue: 1,
      renderFormItem: () => <BooleanRadioGroup />,
    },
    {
      title: '菜单是否缓存',
      dataIndex: 'isCache',
      initialValue: 0,
      renderFormItem: () => <BooleanRadioGroup />,
    },

    // {
    //   valueType: 'divider',
    // },
    // {
    //   title: '权限标识',
    //   dataIndex: 'code',
    //   formItemProps: { rules: [{ required: true }] },
    // },
  ]
}
