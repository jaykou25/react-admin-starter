import request from '@/utils/request'

export function getRoleUsers(params): Promise<any> {
  return request('/api/sysRole/getUserPageList', { params })
}

export function assignRole(data) {
  return request('/api/sysRole/assignRole', {
    method: 'post',
    data,
  })
}

export function cancelRole(data) {
  return request('/api/sysRole/cancelRole', {
    method: 'post',
    data,
  })
}

// 组织架构
export function getOrgTreeList(): Promise<any> {
  return request('/api/glOrg/getOrgTreeList')
}

// 人员查询
export function getOrgUsers(params): Promise<any> {
  return request('/api/sysUser/selectUsers', { params })
}

// 组织架构人员
export function glUser(params): Promise<any> {
  return request(`/api/sysUser/glUser`, {
    method: 'get',
    params,
  })
}

// 组织架构到公司
export async function organizaTreeAllNoDept(params): Promise<any> {
  return request(`/api/sysOrg/glOrg/treeAllNoDept`, {
    method: 'get',
    params,
  })
}
