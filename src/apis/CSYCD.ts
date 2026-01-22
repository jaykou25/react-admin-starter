// src/apis/csycd.ts
import request from '@/utils/request'
import { filterTree } from '@/utils/treeUtil'

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
  return request(`/api/investmentPlan/detail/${id}`, {
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
export async function deleteInvestmentFlow(id: string): Promise<any> {
  return request(`/api/investmentPlan/delete/${id}`, {
    method: 'POST',
  })
}

/**
 * 更新流程状态
 * @param data 状态数据 {id, status}
 * @returns 
 */
export async function updateFlowStatus(data: { id: string; status: string }): Promise<any> {
  return request('/api/investmentPlan/updateStatus', {
    method: 'POST',
    data,
  })
}

/**
 * 导出投资项目流程数据
 * @param params 查询参数
 * @returns 
 */
export async function exportInvestmentFlow(params?: any): Promise<any> {
  return request('/api/investmentPlan/export', {
    method: 'GET',
    params,
    responseType: 'blob',
  })
}

/**
 * 批量删除投资项目流程
 * @param ids 流程ID数组
 * @returns 
 */
export async function batchDeleteInvestmentFlow(ids: string[]): Promise<any> {
  return request('/api/investmentPlan/batchDelete', {
    method: 'POST',
    data: { ids },
  })
}

/*
  当前节点选项
*/
export async function queryCurrentNodeOptions(params = {}): Promise<any> {
  return request('/api/investmentPlan/currentNodeOptions', {
    method: 'GET',
    params,
  })
}

/*
  申请部门选项
*/
export async function queryApplyDeptOptions(params = {}): Promise<any> {
  return request('/api/investmentPlan/applyDeptOptions', {
    method: 'GET',
    params,
  })
}

/*
  流程状态选项（映射到前端状态标签）
*/
export async function queryFlowStatusOptions(params = {}): Promise<any> {
  return request('/api/investmentPlan/statusOptions', {
    method: 'GET',
    params,
  })
}

/*
  合规控制选项
*/
export async function queryComplianceOptions(params = {}): Promise<any> {
  return request('/api/investmentPlan/complianceOptions', {
    method: 'GET',
    params,
  })
}

/*
  会议类型选项（董事会、办公会、党委会等）
*/
export async function queryMeetingTypeOptions(params = {}): Promise<any> {
  return request('/api/investmentPlan/meetingTypeOptions', {
    method: 'GET',
    params,
  })
}

/*
  投资年度选项
*/
export async function queryInvestmentYearOptions(params = {}): Promise<any> {
  return request('/api/investmentPlan/yearOptions', {
    method: 'GET',
    params,
  })
}

/**
 * 同步投资项目流程数据
 * @returns 
 */
export function syncInvestmentFlow(): Promise<any> {
  return request('/api/investmentPlan/synchronize', {
    method: 'POST',
  })
}

/**
 * 获取流程审批记录
 * @param id 流程ID
 * @returns 
 */
export async function queryApprovalRecords(id: string): Promise<any> {
  return request(`/api/investmentPlan/approvalRecords/${id}`, {
    method: 'GET',
  })
}

/**
 * 提交审批
 * @param data 审批数据 {id, remark, nextNode}
 * @returns 
 */
export async function submitApproval(data: any): Promise<any> {
  return request('/api/investmentPlan/submit', {
    method: 'POST',
    data,
  })
}

/**
 * 撤回流程
 * @param id 流程ID
 * @returns 
 */
export async function withdrawFlow(id: string): Promise<any> {
  return request(`/api/investmentPlan/withdraw/${id}`, {
    method: 'POST',
  })
}

/**
 * 获取流程统计信息
 * @param params 统计参数
 * @returns 
 */
export async function queryFlowStatistics(params?: any): Promise<any> {
  return request('/api/investmentPlan/statistics', {
    method: 'GET',
    params,
  })
}

/**
 * 获取待办事项数量
 * @returns 
 */
export async function queryTodoCount(): Promise<any> {
  return request('/api/investmentPlan/todoCount', {
    method: 'GET',
  })
}

/**
 * 获取我发起的流程
 * @param params 查询参数
 * @returns 
 */
export async function queryMyInitiatedFlows(params?: any): Promise<any> {
  return request('/api/investmentPlan/myInitiated', {
    method: 'GET',
    params,
  })
}

/**
 * 获取我审批的流程
 * @param params 查询参数
 * @returns 
 */
export async function queryMyApprovedFlows(params?: any): Promise<any> {
  return request('/api/investmentPlan/myApproved', {
    method: 'GET',
    params,
  })
}

/**
 * 获取流程操作日志
 * @param id 流程ID
 * @returns 
 */
export async function queryFlowOperationLogs(id: string): Promise<any> {
  return request(`/api/investmentPlan/operationLogs/${id}`, {
    method: 'GET',
  })
}

/**
 * 批量更新流程状态
 * @param data 批量更新数据 {ids, status}
 * @returns 
 */
export async function batchUpdateFlowStatus(data: { ids: string[]; status: string }): Promise<any> {
  return request('/api/investmentPlan/batchUpdateStatus', {
    method: 'POST',
    data,
  })
}

/**
 * 复制流程
 * @param id 流程ID
 * @returns 
 */
export async function copyFlow(id: string): Promise<any> {
  return request(`/api/investmentPlan/copy/${id}`, {
    method: 'POST',
  })
}

/**
 * 获取流程模板列表
 * @param params 查询参数
 * @returns 
 */
export async function queryFlowTemplates(params?: any): Promise<any> {
  return request('/api/investmentPlan/templates', {
    method: 'GET',
    params,
  })
}

/**
 * 保存为模板
 * @param data 模板数据
 * @returns 
 */
export async function saveAsTemplate(data: any): Promise<any> {
  return request('/api/investmentPlan/saveAsTemplate', {
    method: 'POST',
    data,
  })
}

/**
 * 从模板创建流程
 * @param templateId 模板ID
 * @returns 
 */
export async function createFromTemplate(templateId: string): Promise<any> {
  return request(`/api/investmentPlan/createFromTemplate/${templateId}`, {
    method: 'POST',
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
  updateFlowStatus,
  exportInvestmentFlow,
  batchDeleteInvestmentFlow,
  queryCurrentNodeOptions,
  queryApplyDeptOptions,
  queryFlowStatusOptions,
  queryComplianceOptions,
  queryMeetingTypeOptions,
  queryInvestmentYearOptions,
  syncInvestmentFlow,
  queryApprovalRecords,
  submitApproval,
  withdrawFlow,
  queryFlowStatistics,
  queryTodoCount,
  queryMyInitiatedFlows,
  queryMyApprovedFlows,
  queryFlowOperationLogs,
  batchUpdateFlowStatus,
  copyFlow,
  queryFlowTemplates,
  saveAsTemplate,
  createFromTemplate,
  FLOW_STATUS_MAP,
  FLOW_STATUS_OPTIONS,
}