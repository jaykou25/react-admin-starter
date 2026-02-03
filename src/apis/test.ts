// src/apis/csycd.ts
import request from '@/utils/request'


/*
投资项目流程管理页
*/

/**
 * 查询投资项目流程列表（分页）
 * @param params 查询参数 {current, pageSize, status?}
 * @returns 
 */
export async function queryInvestmentFlowList(params?: any): Promise<any> {
  return request('/api/investmentPlan/page', {
    method: 'GET',
    params,
  })
}

/**
 * 查询投资项目流程详情
 * @param id 流程ID
 * @returns 
 */
export async function queryInvestmentFlowDetail(id: string): Promise<any> {
  return request(`/api/investmentPlan/info/${id}`, {
    method: 'GET',
  })
}

/**
 * 新增投资项目流程
 * @param data 流程数据
 * @returns 
 */
export async function addInvestmentFlow(data: any): Promise<any> {
  return request('/api/investmentPlan/add', {
    method: 'POST',
    data,
  })
}

/**
 * 编辑投资项目流程 
 * @param data 流程数据
 * @returns 
 */
export async function editInvestmentFlow(data: any): Promise<any> {
  return request('/api/investmentPlan/update', {
    method: 'POST',
    data,
  })
}

/**
 * 删除投资项目流程
 * @param id 流程ID
 * @returns 
 */
export async function deleteInvestmentFlow(ids: string[]): Promise<any> {
  return request(`/api/investmentPlan/delete/`, {
    method: 'POST',
    data:ids,
  })
}


/**
 * 提交审批
 * @param data 
 * @returns 
 */
export async function submitApproval(data: any): Promise<any> {
  return request('/api/investmentPlan/submit', {
    method: 'POST',
    data,
  })
}







export default {
  queryInvestmentFlowList,
  queryInvestmentFlowDetail,
  addInvestmentFlow,
  editInvestmentFlow,
  deleteInvestmentFlow,
  
  submitApproval,
  
  
 
}