import type { TableColumnType } from 'react-admin-kit'
import { DatePicker } from 'antd'
import { LinkButton } from 'react-admin-kit'

import DictSelect from '@/components/dict-select'
import { toRelative } from '@/utils'

const { RangePicker } = DatePicker

// 当前节点选项
export const CURRENT_NODE_OPTIONS = [
  { label: '投资计划编制', value: '投资计划编制' },
  { label: '三会决策', value: '三会决策' },
]

// 1. 单独导出搜索列（供ProTable识别）
export const getColumns = (): TableColumnType[] => [
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
    title: '流程编号',
    dataIndex: 'billCode',
    type: 'search',
    fieldProps: { placeholder: '请输入流程编号' },
  },
  {
    title: '流程标题',
    dataIndex: 'title',
    type: 'search',
    fieldProps: { placeholder: '请输入流程标题' },
  },
  {
    title: '投资年度',
    dataIndex: 'investYear',
    type: 'search',
    fieldProps: {
      placeholder: '请选择投资年度',
      style: { width: '100%' },
      component: DatePicker,
      pickerProps: {
        picker: 'year',
        format: 'YYYY',
        disabledDate: (date) => {
          const currentYear = new Date().getFullYear()
          const minYear = currentYear - 20
          const maxYear = currentYear
          return date.getFullYear() < minYear || date.getFullYear() > maxYear
        },
      },
    },
    renderFormItem: (_, { value, onChange }) => {
      const initValue = value ? new Date(value, 0, 1) : null
      return (
        <DatePicker
          value={initValue}
          picker="year"
          format="YYYY"
          placeholder="请选择投资年度"
          style={{ width: '100%' }}
          onChange={(date) => {
            onChange(date ? date.getFullYear() : null)
          }}
        />
      )
    },
  },
  {
    title: '会议类型',
    dataIndex: 'meetingType',
    type: 'search',
    renderFormItem: () => {
      return <DictSelect type="regulation_meeting_type" mode="multiple" />
    },
  },
  {
    title: '申请部门',
    dataIndex: 'orgName',
    type: 'search',
    fieldProps: { placeholder: '请输入部门名称' },
  },
  {
    title: '申请时间',
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

  // 2. 单独导出表格列（仅用于表格渲染）

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
    fixed: 'left',
  },
  {
    title: '流程状态',
    dataIndex: 'status',
    width: 120,
    render: (text, record) => {
      const statusConfig = {
        0: { text: '已废弃', dotColor: '#ff4d4f' },
        1: { text: '暂存中', dotColor: '#13c2c2' },
        2: { text: '进行中', dotColor: '#1890ff' },
        3: { text: '项目完结', dotColor: '#52c41a' },
        4: { text: '项目终止', dotColor: '#fa8c16' },
      }

      const config = statusConfig[record.status] || {
        text: '未知',
        dotColor: '#d9d9d9',
      }

      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: config.dotColor,
              marginRight: '8px',
              flexShrink: 0,
            }}
          />
          <span style={{ color: '#000000' }}>{config.text}</span>
        </div>
      )
    },
  },
  {
    title: '合规控制',
    dataIndex: 'illegal',
    width: 120,
    render: (text, record) => {
      const value = record.illegal !== undefined ? record.illegal : text

      if (value === 0) {
        return <span style={{ color: '#000000' }}>正常</span>
      } else if (value === 1) {
        return (
          <span
            style={{
              color: '#ff4d4f',
              backgroundColor: '#fff2f0',
              padding: '4px 8px',
              borderRadius: '4px',
              display: 'inline-block',
              fontWeight: 500,
            }}
          >
            异常
          </span>
        )
      }
      return '--'
    },
  },
  {
    title: '单据编号',
    dataIndex: 'billCode',
    width: 200,
    ellipsis: true,
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
      let meetingTypes: string[] = []

      if (record.meetingType && typeof record.meetingType === 'string') {
        meetingTypes = record.meetingType.split(',').map((item) => item.trim())
      } else if (
        record.meetingType !== undefined &&
        record.meetingType !== null
      ) {
        meetingTypes = [record.meetingType.toString()]
      }

      if (meetingTypes.length === 0) {
        return '--'
      }

      const meetingTypeConfig: Record<
        string,
        {
          text: string
          borderColor: string
          color: string
          backgroundColor: string
        }
      > = {
        '3': {
          text: '党委会',
          borderColor: '#ff4d4f',
          color: '#ff4d4f',
          backgroundColor: '#fff1f0',
        },
        '2': {
          text: '董事会',
          borderColor: '#1890ff',
          color: '#1890ff',
          backgroundColor: '#e6f7ff',
        },
        '1': {
          text: '办公会',
          borderColor: '#52c41a',
          color: '#52c41a',
          backgroundColor: '#f6ffed',
        },
      }

      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {meetingTypes.map((type, index) => {
            const config = meetingTypeConfig[type]
            if (!config) {
              return null
            }

            return (
              <div
                key={index}
                style={{
                  backgroundColor: config.backgroundColor,
                  color: config.color,
                  border: `1px solid ${config.borderColor}`,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  lineHeight: '12px',
                  fontWeight: 500,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                }}
              >
                {config.text}
              </div>
            )
          })}
        </div>
      )
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
    width: 150,
    fixed: 'right',
    enableDelete: (record) => {
      console.log('删除状态', record.status, record.status === 1)
      return {
        danger: record.status === 1,
        visible: record.status === 1,
      }
    },

    render: (_, record) => [
      record.status === 1 ? (
        <LinkButton
          key="edit"
          onClick={() => toRelative(`form?id=${record.id}`)}
        >
          编辑
        </LinkButton>
      ) : (
        <LinkButton
          key="view"
          onClick={() => toRelative(`detail?id=${record.id}`)}
        >
          详情
        </LinkButton>
      ),
    ],
  },
]
