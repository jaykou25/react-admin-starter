// src/pages/test/investmentForm/columns.ts
import type { FormColumnType } from 'react-admin-kit'
import { DatePicker, Input } from 'antd'
import DictSelect from '@/components/dict-select'
import dayjs from 'dayjs'

export const columns: FormColumnType[] = [
  {
    title: '流程标题',
    dataIndex: 'title',
    fieldProps: {
      placeholder: '请输入流程标题',
    },
    formItemProps: {
      rules: [{ required: true, message: '请输入流程标题' }],
    },
    colProps: {
      span: 12,
    },
  },
  {
    title: '投资年度',
    dataIndex: 'investYear',
    valueType: 'dateYear', // 使用内置的日期年份类型
    formItemProps: {
      rules: [{ required: true, message: '请选择投资年度' }],
    },
    fieldProps: {
      picker: 'year',
      placeholder: '请选择投资年度',
      format: 'YYYY',
      allowClear: true,
    },
    colProps: {
      span: 12,
    },
    // 处理表单值转换
    convertValue: (value) => {
      // 从后端获取的值转换为 dayjs
      if (typeof value === 'number') {
        return dayjs(`${value}-01-01`)
      }
      return value
    },
  },
  {
    title: '会议类型',
    dataIndex: 'meetingType',
    formItemProps: {
      rules: [{ required: true, message: '请选择会议类型' }],
    },
    colProps: {
      span: 24,
    },
    renderFormItem: () => {
      return (
        <DictSelect
          type="regulation_meeting_type"
          mode="multiple"
          placeholder="请选择会议类型"
          style={{ width: '100%' }}
          allowClear
        />
      )
    },
  },
  {
    title: '汇报内容',
    dataIndex: 'content',
    valueType: 'textarea',
    fieldProps: {
      placeholder: '请输入汇报内容',
      rows: 8,
    },
    formItemProps: {
      rules: [{ required: true, message: '请输入汇报内容' }],
    },
    colProps: {
      span: 24,
    },
  },
]
