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



// 状态映射常量（根据图片中的映射关系）
export const FLOW_STATUS_MAP = {
  '2': { text: '进行中', color: 'processing', value: 'processing' },
  '1': { text: '暂存中', color: 'default', value: 'draft' },
  '3': { text: '项目完结', color: 'success', value: 'completed' },
  '4': { text: '项目终止', color: 'warning', value: 'terminated' },
  '0': { text: '已废弃', color: 'error', value: 'abandoned' },
} as const

// 状态选项（用于前端筛选按钮）
export const FLOW_STATUS_OPTIONS = [
  { value: '2', label: '进行中' },
  { value: '1', label: '暂存中' },
  { value: '3', label: '项目完结' },
  { value: '4', label: '项目终止' },
  { value: '0', label: '已废弃' },
  { value: '', label: '全部' },
]
// 合规控制状态映射
export const ILLEGAL_STATUS_MAP = {
  '0': { text: '正常', color: 'green' },
  '1': { text: '异常', color: 'red' },
} as const

export default {
  queryInvestmentFlowList,
  queryInvestmentFlowDetail,
  addInvestmentFlow,
  editInvestmentFlow,
  deleteInvestmentFlow,
  
  submitApproval,
  
  FLOW_STATUS_MAP,
  FLOW_STATUS_OPTIONS,
}