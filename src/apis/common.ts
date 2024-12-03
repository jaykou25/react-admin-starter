import request from '@/utils/request'

export async function queryMenu(): Promise<any> {
  return request('/api/sysUser/getMenuTree')
}

export async function queryCurrent(): Promise<any> {
  return request('/api/sysUser/getUserInfo')
}

export async function queryCode() {
  return request('/api/verificationCode/getBase64Image')
}

export async function postLogin(data) {
  return request('/api/easyLogin', {
    method: 'post',
    data,
    noToken: true,
  })
}
// userCode（EmpId）登录
export async function userCodeLogin(data) {
  return request('/api/SSO/getTokenByEmpId', {
    method: 'post',
    data,
  })
}

/**
 * 人员下拉
 */
export async function joinUserList(params): Promise<any> {
  return request('/api/sysUser/selectUsers', {
    params,
  })
}
/**
 * 省市区数据
 */
export async function getAreaList(params): Promise<any> {
  return request('/api/sysArea/getChinaAreaTree', {
    params,
  })
}

/**
 * 部门树
 */
export async function deptTree(params): Promise<any> {
  return request('/api/sysOrg/getOrgTree', {
    params,
  })
}

// 子公司的树
export function queryCompanys(params) {
  return request('/companys', {
    params,
  })
}

// 附件查看
export function getImage(accId) {
  return request(`/api/accessory/getImage?accId=${accId}`, {
    responseType: 'blob',
  })
}

// 修改密码
export function changePassword(data) {
  return request('/api/sysUser/updatePassword', {
    method: 'post',
    data,
  })
}

// 单点登录
export function casLogin(data) {
  return request('/api/SSO/getToken', { method: 'post', data })
}
