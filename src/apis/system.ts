import request from '@/utils/request'
import { filterTree } from '@/utils/treeUtil'

/*
用户管理页
*/

export async function queryDeptTree(params?: any): Promise<any> {
  return request('/api/sysOrg/getPageOrgTree', {
    params,
  })
}

export async function queryUsers(params): Promise<any> {
  return request('/api/users', {
    params,
  })
}

// 这个接口用于用户列表页(是加数据权限的, 与它的名字all相反)
export async function queryUsersAll(params): Promise<any> {
  return request('/api/sysUser/page', {
    params,
  })
}

// 新增用户
export async function addUser(data): Promise<any> {
  return request('/api/sysUser/add', {
    method: 'post',
    data,
  })
}

// 修改用户
export async function editUser(data): Promise<any> {
  return request('/api/sysUser/update', {
    method: 'post',
    data,
  })
}

// 删除用户
export async function delUser(id): Promise<any> {
  return request(`/api/sysUser/delete/${id}`, {
    method: 'post',
  })
}

// 同步用户
export function syncUsers(): Promise<any> {
  return request('/api/users/synchronize', {
    method: 'post',
  })
}

/**
 * 公司列表
 * @param params
 * @returns
 */
export async function queryOrgCompany(params = {}): Promise<any> {
  return request('/api/sysOrg/companyOption', {
    params,
  })
}

/*
  字典管理页
*/
export function queryDicts(params): Promise<any> {
  return request('/api/sysDict/page', { params })
}

export function queryDictDetail(params): Promise<any> {
  return request('/api/sysDict/detail', { params })
}

export function addDict(data) {
  return request('/api/sysDict/add', {
    method: 'post',
    data,
  })
}

export function addDictDetail(data) {
  return request('/api/sysDict/addOrUpdateItem', {
    method: 'post',
    data,
  })
}

export function editDict(data) {
  return request('/api/sysDict/update', {
    method: 'post',
    data,
  })
}

export function editDictDetail(data) {
  return request('/api/sysDict/addOrUpdateItem', {
    method: 'post',
    data,
  })
}

export function delDict(id) {
  return request(`/api/sysDict/delete/${id}`, {
    method: 'post',
  })
}

export function delDictDetail(ids) {
  return request(`/api/sysDict/deleteItem/${ids[0]}`, {
    method: 'post',
  })
}

// 角色
export function queryRoles(params?: any): Promise<any> {
  return request('/api/sysRole/getList', { params })
}

export function queryRole(id): Promise<any> {
  return request(`/api/roles/${id}`)
}

export function addRole(data) {
  return request('/api/sysRole/add', {
    method: 'post',
    data,
  })
}

export function editRole(data) {
  return request('/api/sysRole/update', {
    method: 'post',
    data,
  })
}

export function delRoles(id) {
  return request(`/api/sysRole/delete/${id}`, {
    method: 'post',
  })
}

// 分配菜单
export function saveRoleMenus(data) {
  return request('/api/sysRole/update', {
    method: 'post',
    data,
  })
}

// 菜单
export function queryMenusNoButton(params = {}): Promise<any> {
  return request('/api/sysPermission/getTree', { params }).then((res) => {
    // 过滤掉类型为按钮的菜单 type: 2

    return filterTree(res, (item) => item.type < 2)
  })
}

/**
 * 请求菜单详情
 * @param {}
 * @returns
 */
export function queryMenuInfo(id): Promise<any> {
  return request(`/api/sysPermission/info/${id}`)
}

export function queryMenusTree(): Promise<any> {
  return request('/api/sysPermission/getTree')
}

export function addMenus(data) {
  return request('/api/sysPermission/add', {
    method: 'post',
    data,
  })
}

export function editMenu(data) {
  return request('/api/sysPermission/update', {
    method: 'post',
    data,
  })
}

export function delMenus(id) {
  return request(`/api/sysPermission/delete/${id}`, {
    method: 'post',
  })
}

// 组织
export function queryDepts(params?: any): Promise<any> {
  return request('/api/dept', { params })
}

export function addDepts(data) {
  return request('/api/sysOrg/add', {
    method: 'post',
    data,
  })
}

export function editDept(data) {
  return request('/api/sysOrg/update', {
    method: 'post',
    data,
  })
}

export function delDept(ids) {
  return request(`/api/sysOrg/delete/${ids[0]}`, {
    method: 'post',
  })
}

export function syncDepts(): Promise<any> {
  return request('/api/dept/synchronize', {
    method: 'post',
  })
}

// 参数设置管理
export function queryConfig(id): Promise<any> {
  return request(`/api/config/getById/${id}`)
}

export function queryConfigs(params?: any): Promise<any> {
  return request('/api/config/page', { params })
}

export function addConfigs(data) {
  return request('/api/config/add', {
    method: 'post',
    data,
  })
}

export function editConfig(data) {
  return request('/api/config/update', {
    method: 'post',
    data,
  })
}

export function delConfig(id) {
  return request(`/api/config/delete/${id}`, {
    method: 'post',
  })
}

// 修改密码
export function updatePass(data) {
  return request('/api/users/updatePass', {
    method: 'post',
    data,
  })
}

// 修改用户
export function updateUserCenter(data) {
  return request('/api/users/center', {
    method: 'put',
    data,
  })
}

// 修改头像
export function updateAvatar(data) {
  return request('/api/users/updateAvatar', {
    method: 'post',
    data,
  })
}

// 访问记录
export function usersVisits(params) {
  return request('/api/logs/user', { params })
}

// 部门设为默认通知
export function setNoticeDept(id) {
  return request(`/api/sysOrg/setNoticeDept/${id}`)
}

// 取消部门默认通知
export function cancelNoticeDept(id) {
  return request(`/api/sysOrg/cancelNoticeDept/${id}`)
}
