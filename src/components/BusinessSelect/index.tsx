import { BusinessSelectBuilder } from 'react-admin-kit'
import { queryOrgCompany, queryRoles, joinUserList } from '@/apis'
import request from '@/utils/request'

type BusinessSelectType =
  | 'role'
  | 'joinUser'
  | 'orgCompany' // 企业下拉框, 用于用户管理页中的企业
  | 'ownCompany' // 所属企业
  | 'childCompany' //下级子企业通用
  | 'ownCompanyDept' // 本企业下部门
  | 'ownCompanyDirectDept' // 本企业下直属部门（不包含子企业的部门）
  | 'staff' // 人员选择

const BusinessSelect = BusinessSelectBuilder<BusinessSelectType>({
  apis: [
    {
      api: () => queryRoles().then((res) => ({ data: res })),
      type: 'role',
      defaultProps: {
        noCache: true,
      },
    },
    {
      api: ({ current, searchValue, ...rest }) =>
        joinUserList({ current, username: searchValue, ...rest }),
      type: 'joinUser',
      pagination: true,
      defaultProps: {
        labelKey: 'username',
        valueKey: 'id',
        // renderLabel: (node) => `${node.nickName} ${node.username}`,
        renderLabel: (node) => {
          if (node.userInfo?.orgName) {
            return `${node.nickname || node.username} - ${
              node.userInfo.orgName
            }`
          } else {
            return `${node.nickname || node.username}`
          }
        },
      },
    },
    {
      type: 'orgCompany',
      api: () => queryOrgCompany().then((res) => ({ data: res })),
      defaultProps: {
        valueKey: 'companyId',
      },
    },
    {
      type: 'ownCompany',
      api: () =>
        request('/api/main/sysOrg/companyOption').then((res) => {
          return { data: res }
        }),
      defaultProps: {
        labelKey: 'name',
        valueKey: 'companyId',
      },
    },
    {
      type: 'childCompany',
      api: () =>
        request('/api/main/sysOrg/getChildCompanys').then((res) => {
          return { data: res }
        }),
      defaultProps: {
        labelKey: 'name',
        valueKey: 'id',
      },
    },
    {
      type: 'ownCompanyDept',
      api: () =>
        request('/api/main/deptTargetLiability/getDept').then((res) => {
          return { data: res }
        }),
      defaultProps: {
        noCache: true,
        labelKey: 'name',
        valueKey: 'deptId',
      },
    },

    {
      type: 'ownCompanyChild',
      api: () =>
        request('/api/main/deptTargetLiability/childCompany').then((res) => {
          return { data: res }
        }),
      defaultProps: {
        labelKey: 'name',
        valueKey: 'id',
      },
    },
    {
      type: 'childCompanyUser',
      api: ({ id }) =>
        request(`/api/main/notice/getProcessUser/${id}`).then((res) => {
          return { data: res }
        }),
      defaultProps: {
        labelKey: 'nickname',
        valueKey: 'id',
      },
    },
    {
      type: 'myCompanyUser',
      api: ({ params }) =>
        request
          .post('/api/main/notice/getProcessUser', { ids: params })
          .then((res) => {
            return { data: res }
          }),
      defaultProps: {
        renderLabel: (node) => {
          if (node.companyName) {
            return `${node.nickname || node.username} - ${node.companyName}`
          }
          return `${node.nickname || node.username}`
        },
      },
    },

    {
      type: 'staff',
      pagination: true,
      api: ({ current, searchValue, orgId, companyId }) =>
        request('/api/main/sysUser/selectUsers', {
          params: {
            current,
            keyword: searchValue,
            companyId: companyId || window['_companyId'],
            orgId,
          },
        }),
      defaultProps: {
        renderLabel: (node) => {
          if (node.userInfo?.companyAbbr) {
            if (node.userInfo?.orgName) {
              return `${node.nickname || node.username} - ${
                node.userInfo.companyAbbr
              } - ${node.userInfo.orgName}`
            } else {
              return `${node.nickname || node.username} - ${
                node.userInfo.companyAbbr
              }`
            }
          }
          return `${node.nickname || node.username}`
        },
        placeholder: '请选择或输入关键字搜索',
      },
    },
  ],
  defaultProps: {
    placeholder: '请选择',
  },
})

export default BusinessSelect
