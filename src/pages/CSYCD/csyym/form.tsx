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
} from 'antd'
import {
  ArrowLeftOutlined,
  SaveOutlined,
  SendOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons'
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
      <Card
        bordered={false}
        style={{
          borderRadius: 8,
          minHeight: 'calc(100vh - 180px)',
          boxShadow:
            '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
        }}
        bodyStyle={{
          padding: '32px 40px',
          position: 'relative',
        }}
      >
        <div
          style={{
            marginBottom: 16,
            borderRadius: 8,
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 8px rgba(24, 144, 255, 0.2)',
          }}
        >
          {/* 左侧：返回按钮和标题 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Title
              level={4}
              style={{
                margin: 0,
                color: '#000000',
                fontWeight: 600,
                fontSize: 18,
              }}
            >
              国联集团-管理员发起的投资计划流程申请
            </Title>
          </div>

          {/* 右侧：操作按钮 */}
          <Space>
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
        <div
          style={{
            position: 'relative',
            marginBottom: 40,
            paddingBottom: 16,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: '100%',
              height: '2px',
              background: '#f0f0f0',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: '100px',
              height: '2px',
              background: '#1890ff',
            }}
          />
          <Title
            level={5}
            style={{
              margin: 0,
              color: '#1890ff',
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: 0.5,
            }}
          >
            基本信息
          </Title>
        </div>

        <Form
          form={form}
          layout="horizontal"
          requiredMark={false}
          initialValues={{
            meetingType: ['1', '2'],
          }}
        >
          <div style={{ display: 'flex', gap: '24px' }}>
            {/* 流程标题 */}
            <Form.Item
              label={
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: 14,
                    fontWeight: 500,
                    color: 'rgba(0, 0, 0, 0.85)',
                  }}
                >
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
              <Input
                placeholder="请输入"
                style={{
                  width: '100%',
                  maxWidth: 600,
                  height: 40,
                  borderRadius: 4,
                  border: '1px solid #d9d9d9',
                }}
              />
            </Form.Item>

            {/* 投资年度 */}
            <Form.Item
              label={
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: 'rgba(0, 0, 0, 0.85)',
                  }}
                >
                  <span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>
                  投资年度
                </div>
              }
              name="investYear"
              rules={[{ required: true, message: '请选择投资年度' }]}
              style={{ marginBottom: 32 }}
            >
              <Select
                placeholder="请选择"
                style={{
                  width: 200,
                  height: 40,
                }}
                allowClear
                suffixIcon={null}
              >
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
          </div>

          {/* 会议类型 */}
          <Form.Item
            label={
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'rgba(0, 0, 0, 0.85)',
                }}
              >
                <span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>
                会议类型
              </div>
            }
            name="meetingType"
            rules={[{ required: true, message: '请选择会议类型' }]}
            style={{ marginBottom: 32 }}
            initialValue={['1', '2']} // 默认选中两个
            renderFormItem={(_, { value, onChange }) => {
              return (
                <DictSelect
                  type="regulation_meeting_type"
                  // 关键：传递值和 onChange 以适配 Form 表单
                  value={value}
                  onChange={onChange}
                  // 保留原有样式和交互属性
                  style={{
                    width: '100%',
                    maxWidth: 400,
                  }}
                  allowClear // 清除按钮
                  mode="multiple" // 多选模式（和原 Select 一致）
                  placeholder="请选择会议类型"
                />
              )
            }}
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
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'rgba(0, 0, 0, 0.85)',
                }}
              >
                <span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>
                汇报内容
              </div>
            }
            name="content"
            rules={[{ required: true, message: '请输入汇报内容' }]}
            style={{ marginBottom: 32 }}
          >
            <TextArea
              placeholder="请输入"
              rows={8}
              style={{
                width: '100%',
                maxWidth: 800,
                borderRadius: 4,
                border: '1px solid #d9d9d9',
                resize: 'vertical',
              }}
              maxLength={2000}
              showCount={{
                formatter: ({ count, maxLength }) => `${count}/${maxLength} 字`,
              }}
            />
          </Form.Item>
        </Form>
      </Card>

      {/* 底部版权信息 */}
      <div
        style={{
          textAlign: 'center',
          padding: '24px 0',
          color: '#666',
          fontSize: 14,
          marginTop: 16,
          borderTop: '1px solid #f0f0f0',
        }}
      >
        <Text type="secondary">© 2017 国联资产 版权所有</Text>
      </div>
    </div>
  )
}

export default InvestmentFormPage
