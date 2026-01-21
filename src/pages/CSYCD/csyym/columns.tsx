// src/pages/pv/CSYCD/columns.ts
import type { TableColumnType } from 'react-admin-kit'
import { DatePicker, Input, Select, Tag, Badge } from 'antd'
import { LinkButton } from 'react-admin-kit'
import { hasPermission } from '@/utils'

const { RangePicker } = DatePicker

// 会议类型选项
export const MEETING_TYPE_OPTIONS = [
  { label: '党委会', value: 1 },
  { label: '董事会', value: 2 },
  { label: '总经理办公会', value: 3 },
]

// 当前节点选项
export const CURRENT_NODE_OPTIONS = [
  { label: '投资计划编制', value: '投资计划编制' },
  { label: '三会决策', value: '三会决策' },
]

// 1. 单独导出搜索列（供ProTable识别）
export const getSearchColumns = (): TableColumnType[] => [
  {
    title: '单据编号',
    dataIndex: 'billCode',
    type: 'search',
    fieldProps: { placeholder: '请输入单据编号' },
  },
  {
    title: '流程标题',
    dataIndex: 'title',
    type: 'search',
    fieldProps: { placeholder: '请输入流程标题' },
  },
  {
    title: '当前节点',
    dataIndex: 'currentNodeName',
    type: 'search',
    valueType: 'select',
    fieldProps: {
      options: CURRENT_NODE_OPTIONS,
      placeholder: '请选择当前节点',
      allowClear: true,
    },
  },
  {
    title: '投资年份',
    dataIndex: 'investYear',
    type: 'search',
    valueType: 'digit',
    fieldProps: {
      placeholder: '请输入投资年份',
      style: { width: '100%' },
    },
  },
  {
    title: '会议类型',
    dataIndex: 'meetingType',
    type: 'search',
    valueType: 'select',
    fieldProps: {
      options: MEETING_TYPE_OPTIONS,
      placeholder: '请选择会议类型',
      allowClear: true,
    },
  },
  {
    title: '创建人',
    dataIndex: 'createUserName',
    type: 'search',
    fieldProps: { placeholder: '请输入创建人姓名' },
  },
  {
    title: '所属部门',
    dataIndex: 'orgName',
    type: 'search',
    fieldProps: { placeholder: '请输入部门名称' },
  },
  {
    title: '提交时间',
    dataIndex: 'submitTime',
    type: 'search',
    valueType: 'dateRange',
    renderFormItem: () => (
      <RangePicker
        placeholder={['开始时间', '结束时间']}
        style={{ width: '100%' }}
      />
    ),
    transform: (value) => {
      if (value && value.length === 2) {
        return {
          startTime: value[0]?.format?.('YYYY-MM-DD 00:00:00'),
          endTime: value[1]?.format?.('YYYY-MM-DD 23:59:59'),
        }
      }
      return {}
    },
  },
]

// 2. 单独导出表格列（仅用于表格渲染）
export const getTableColumns = (): TableColumnType[] => [
  {
    title: '序号',
    dataIndex: 'index',
    valueType: 'index',
    width: 60,
    fixed: 'left',
  },
  {
    title: '当前节点',
    dataIndex: 'currentNodeName',
    width: 120,
    copyable: true,
    fixed: 'left',
  },
  {
    title: '流程状态',
    dataIndex: 'status',
    width: 120,
    valueEnum: {
      0: { text: '已废弃', status: 'Banned' },
      1: { text: '暂存中', status: 'Holding' },
      2: { text: '进行中', status: 'Processing' },
      3: { text: '项目完结', status: 'ProjectEnded' },
      4: { text: '项目终止', status: 'ProjectStopped' },
    },
  },
  {
    title: '合规控制',
    dataIndex: 'illegal',
    width: 120,
    valueEnum: {
      0: { text: '正常', status: 'OK' },
      1: { text: '异常', status: 'Error' },
    },
  },
  {
    title: '单据编号',
    dataIndex: 'billCode',
    width: 200,
    ellipsis: true,
    copyable: true,
  },
  {
    title: '流程标题',
    dataIndex: 'title',
    width: 200,
    ellipsis: true,
  },
  {
    title: '投资年度',
    dataIndex: 'investYear',
    width: 100,
  },
  {
    title: '会议类型',
    dataIndex: 'meetingTypeName',
    width: 120,
    render: (_, record) => {
      const typeMap = {
        1: '党委会',
        2: '董事会',
        3: '总经理办公会',
      }
      return typeMap[record.meetingType] || '--'
    },
  },
  {
    title: '申请部门',
    dataIndex: 'orgName',
    width: 120,
  },
  {
    title: '申请人',
    dataIndex: 'createUserName',
    width: 100,
  },
  {
    title: '申请时间',
    dataIndex: 'submitTime',
    width: 150,
    ellipsis: true,
    valueType: 'dateTime',
  },
  {
    title: '操作',
    dataIndex: 'option',
    valueType: 'option',
    width: 120,
    fixed: 'right',
    enableDelete: () => ({ danger: true }),
    render: (_, record, index, action, innerRef) => [
      <LinkButton
        visible={() => hasPermission('investment:edit')}
        key="edit"
        onClick={() => {
          // 编辑逻辑
          console.log('编辑', record)
        }}
      >
        编辑
      </LinkButton>,
      <LinkButton
        visible={() => hasPermission('investment:view')}
        key="view"
        onClick={() => {
          // 查看逻辑
          console.log('查看', record)
        }}
      >
        查看
      </LinkButton>,
    ],
  },
].map((col) => ({
  ...col,
  align: col.align || 'center',
}))

// 3. 兼容原有调用（可选，建议直接用拆分后的方法）
export const getColumns = (): TableColumnType[] => {
  // 合并时移除表格列中可能被误识别的属性
  const tableCols = getTableColumns().map(col => {
    // 删除可能触发搜索的属性
    const { type, valueType, fieldProps, transform, ...rest } = col
    return rest
  })
  return [...getSearchColumns(), ...tableCols]
}