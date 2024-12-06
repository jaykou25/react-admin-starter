import {
  deptTree,
  queryCompanys,
  queryMenusNoButton,
  queryDeptTree,
} from '@/apis'
import request from '@/utils/request'
import { BusinessTreeSelectBuilder } from 'react-admin-kit'

type TreeType =
  | 'menu'
  | 'allDept'
  | 'deptTree' // 组织架构, 可用于新增角色时的自定义权限的选择
  | 'companys'
  | 'childCompanyDept'
  | 'childCompany' //下级子企业 带部门
  | 'companyTree' // 企业树状结构

const BusinessTreeSelect = BusinessTreeSelectBuilder<TreeType>({
  apis: [
    {
      api: queryMenusNoButton,
      type: 'menu',
    },
    {
      api: () => queryDeptTree(),
      type: 'allDept',
      defaultProps: {
        noCache: true,
      },
    },
    {
      type: 'deptTree',
      api: (params) => deptTree(params),
    },
    {
      type: 'companys',
      api: (params) => queryCompanys(params),
    },
    {
      type: 'childCompanyDept',
      api: () => request('/api/glOrg/getChildCompanyDept'),
      defaultProps: {
        labelKey: 'title',
        valueKey: 'orgid',
      },
    },
    {
      type: 'childCompany',
      api: () => request('/api/sysOrg/getChildCompanys'),
      defaultProps: {
        labelKey: 'name',
        valueKey: 'id',
        fieldNames: {
          label: 'name',
          value: 'id',
          children: 'sysDepts',
        },
      },
    },
    {
      type: 'companyTree',
      api: () => request('/api/sysOrg/companyTreeOption'),
      defaultProps: {
        labelKey: 'name',
        valueKey: 'id',
        fieldNames: {
          label: 'name',
          value: 'id',
          children: 'children',
        },
      },
    },
  ],
})

export default BusinessTreeSelect
