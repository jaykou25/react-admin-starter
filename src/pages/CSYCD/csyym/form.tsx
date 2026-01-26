// src/pages/CSYCD/csyym/form.tsx
import React, { useState } from 'react'
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Radio,
  Space,
  Typography,
  message,
  Row,
  Col,
} from 'antd'

import { history, useModel } from 'umi'
import { addInvestmentFlow, submitApproval } from '@/apis/CSYCD'
import { hasPermission } from '@/utils'
import DictSelect from '@/components/dict-select'

const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select

const InvestmentFormPage: React.FC = () => {
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)
  const [saving, setSaving] = useState(false)
  const { initialState } = useModel('@@initialState')
  const { currentUser } = initialState
  const { userInfo } = currentUser

  const handleBack = () => {
    history.push('/CSYCD/csyym')
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      setSaving(true)

      const saveData = {
        title: values.title,
        investYear: String(values.investYear),
        meetingType: values.meetingType.join(','),
        content: values.content,

        companyName: '国联集团',
      }

      await addInvestmentFlow(saveData)
      message.success('暂存成功')
    } catch (error) {
      console.error('暂存失败:', error)
      message.error('暂存失败，请检查表单')
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setSubmitting(true)

      const submitData = {
        title: values.title,
        investYear: String(values.investYear),
        meetingType: values.meetingType.join(','),
        content: values.content,
        orgId: userInfo.orgId,
        candidateList: [],

        companyName: userInfo.companyName,
      }

      await submitApproval(submitData)
      message.success('提交成功')

      setTimeout(() => {
        history.push('/CSYCD/csyym')
      }, 1500)
    } catch (error) {
      console.error('提交失败:', error)
      message.error('提交失败，请检查表单')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      style={{
        padding: 0,
        minHeight: 'calc(100vh - 48px)',
      }}
    >
      {/* 表单内容区域 */}
      <Card>
        <div>
          <Space>
            <Title level={4}>国联集团-管理员发起的投资计划流程申请</Title>
            <Button onClick={handleBack}>返回</Button>
            <Button
              onClick={handleSave}
              loading={saving}
              disabled={!hasPermission('investment:save')}
            >
              暂存
            </Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={submitting}
              disabled={!hasPermission('investment:submit')}
            >
              提交
            </Button>
          </Space>
        </div>

        {/* 基本信息标题 - 蓝色线条和文字 */}
        <div>
          <Title level={5}>基本信息</Title>
        </div>

        <Form
          form={form}
          layout="horizontal"
          requiredMark={false}
          initialValues={{
            meetingType: ['1', '2'],
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              {/* 流程标题 */}
              <Form.Item
                label={
                  <div>
                    <span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>
                    <span>流程标题</span>
                  </div>
                }
                name="title"
                rules={[
                  { required: true, message: '请输入流程标题' },
                  { max: 100, message: '标题最多100个字符' },
                ]}
                style={{ marginBottom: 32 }}
              >
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              {/* 投资年度 */}
              <Form.Item
                label={
                  <div>
                    <span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>
                    投资年度
                  </div>
                }
                name="investYear"
                rules={[{ required: true, message: '请选择投资年度' }]}
                style={{ marginBottom: 32 }}
              >
                <Select placeholder="请选择" allowClear suffixIcon={null}>
                  {Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() + i
                    return (
                      <Option key={year} value={year}>
                        {year}
                      </Option>
                    )
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <div style={{ display: 'flex' }}></div>

          {/* 会议类型 */}
          <Form.Item
            label={
              <div>
                <span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>
                会议类型
              </div>
            }
            name="meetingType"
            rules={[{ required: true, message: '请选择会议类型' }]}
            style={{ marginBottom: 32 }}
            initialValue={['1', '2']} // 默认选中两个
          >
            <DictSelect
              mode="multiple" // 多选模式
              placeholder="请选择会议类型"
              style={{
                width: '100%',
                maxWidth: 400,
              }}
              allowClear
              type="regulation_meeting_type"
            />
          </Form.Item>

          {/* 汇报内容 */}
          <Form.Item
            label={
              <div>
                <span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>
                汇报内容
              </div>
            }
            name="content"
            rules={[{ required: true, message: '请输入汇报内容' }]}
            style={{ marginBottom: 32 }}
          >
            <TextArea placeholder="请输入" rows={8} />
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default InvestmentFormPage
