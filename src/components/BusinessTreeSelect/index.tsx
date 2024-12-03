import {
  deptTree,
  queryCompanys,
  queryMenusNoButton,
  queryDeptTree,
} from '@/apis'
import request from '@/utils/request'
import { filterTree } from '@/utils/treeUtil'
import { BusinessTreeSelectBuilder } from 'react-admin-kit'

type TreeType =
  | 'menu'
  | 'allDept'
  | 'deptTree' // 组织架构, 可用于新增角色时的自定义权限的选择
  | 'companys'
  | 'hiddenDangerType' // 隐患类别
  | 'hiddenDangerCategoryType' // 隐患大类
  | 'hiddenDangerArea' // 隐患区域
  | 'deptByCompanyId' // 获取选择企业组织架构
  | 'childCompanyDept'
  | 'childCompany' //下级子企业 带部门
  | 'companyTree' // 企业树状结构
  | 'subCompanyTree' // 企业树状结构（用于选择下级任一层级的企业）
  | 'getPageOrgTree'
  | 'childCompanyUser'
  | 'userType' //人员类别
  | 'hiddenDangerTypeOnlyLeaf' //隐患类别-只能最下级
  | 'hiddenDangerCategoryTypeOnlyLeaf' //隐患大类-只能最下级

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
      type: 'deptByCompanyId',
      api: () =>
        request(`/api/sysOrg/selectOrgTreeUsers`).then((res) => {
          return { data: res }
        }),
      defaultProps: {},
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
      type: 'childCompanyUser',
      api: ({ params }) =>
        request
          .post('/api/sysOrg/getChildCompanys', { ids: params })
          .then((res) => {
            return { data: res }
          }),
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
    {
      type: 'subCompanyTree',
      api: () => request('/api/sysOrg/subsidiary'),
      defaultProps: {
        labelKey: 'name',
        valueKey: 'companyId',
        fieldNames: {
          label: 'name',
          value: 'companyId',
          children: 'children',
        },
      },
    },
    {
      type: 'getPageOrgTree',
      api: () => {
        return request(
          `/api/sysOrg/getOrgTree?companyId=${window['_companyId']}`
        ).then((res) => {
          let data = filterTree(res || [], (node) => {
            return node.orgType !== '1003'
          })
          return data
        })
      },
      defaultProps: {
        labelKey: 'name',
        valueKey: 'id',
        // fieldNames: {
        //   label: 'name',
        //   value: 'id',
        // },
      },
    },
    {
      type: 'userType',
      api: () => request('/api/sysDict/other/user/info/dict'),
      defaultProps: {
        labelKey: 'label',
        valueKey: 'value',
        fieldNames: {
          // label: 'name',
          // value: 'id',
          // children: 'children',
        },
      },
    },
  ],
})

export default BusinessTreeSelect
