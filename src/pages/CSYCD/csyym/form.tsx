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
import { history } from 'umi'
import { addInvestmentFlow } from '@/apis/CSYCD'
import { hasPermission } from '@/utils'

const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select

const InvestmentFormPage: React.FC = () => {
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleBack = () => {
    history.push('/CSYCD/csyym')
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      setSaving(true)

      const saveData = {
        ...values,
        status: 1,
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
        ...values,
        status: 2,
      }

      await addInvestmentFlow(submitData)
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
      {/* 顶部操作栏 - 匹配图片中的蓝色渐变 */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
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
          <Button
            type="default"
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'rgba(0, 0, 0, 0.85)',
              fontWeight: 500,
            }}
          >
            返回
          </Button>
          <Title
            level={4}
            style={{
              margin: 0,
              color: '#fff',
              fontWeight: 600,
              fontSize: 18,
            }}
          >
            国联集团-管理员发起的投资计划流程申请
          </Title>
        </div>

        {/* 右侧：操作按钮 */}
        <Space>
          <Button
            style={{
              width: 88,
              height: 40,
              borderRadius: 4,
              border: '1px solid #d9d9d9',
              background: '#fff',
              color: 'rgba(0, 0, 0, 0.85)',
            }}
            onClick={handleBack}
          >
            取消
          </Button>
          <Button
            icon={<SaveOutlined />}
            onClick={handleSave}
            loading={saving}
            disabled={!hasPermission('investment:save')}
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'rgba(0, 0, 0, 0.85)',
              fontWeight: 500,
            }}
          >
            暂存
          </Button>
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSubmit}
            loading={submitting}
            disabled={!hasPermission('investment:submit')}
            style={{
              background: '#fff',
              borderColor: '#fff',
              color: '#1890ff',
              fontWeight: 500,
            }}
          >
            提交
          </Button>
        </Space>
      </div>

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
          layout="vertical"
          requiredMark={false}
          initialValues={{
            meetingType: 'office',
          }}
        >
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
                <Button
                  type="link"
                  size="small"
                  icon={<QuestionCircleOutlined />}
                  onClick={() =>
                    message.info('流程标题应简明扼要地描述投资计划的主要内容')
                  }
                  style={{
                    marginLeft: 8,
                    color: '#1890ff',
                    padding: '0 4px',
                    fontSize: 12,
                    height: 'auto',
                  }}
                >
                  填报说明
                </Button>
                <Button
                  type="link"
                  size="small"
                  style={{
                    marginLeft: 4,
                    color: '#1890ff',
                    padding: '0 4px',
                    fontSize: 12,
                    height: 'auto',
                  }}
                >
                  去填写
                </Button>
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
            initialValue={['office', 'board']} // 默认选中两个
          >
            <Select
              mode="multiple" // 多选模式
              placeholder="请选择会议类型"
              style={{
                width: '100%',
                maxWidth: 400,
              }}
              allowClear
              options={[
                { label: '办公会', value: 'office' },
                { label: '董事会', value: 'board' },
                { label: '党委会', value: 'party' },
              ]}
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

          {/* 协作人 */}
          <Form.Item
            label={
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'rgba(0, 0, 0, 0.85)',
                }}
              >
                协作人
              </div>
            }
            name="collaborators"
            style={{ marginBottom: 24 }}
          >
            <Input
              placeholder="请输入关键字搜索"
              style={{
                width: '100%',
                maxWidth: 400,
                height: 40,
                borderRadius: 4,
                border: '1px solid #d9d9d9',
              }}
              suffix={
                <Button
                  type="link"
                  size="small"
                  style={{
                    padding: '0 8px',
                    height: 'auto',
                    color: '#1890ff',
                    border: 'none',
                    background: 'transparent',
                  }}
                >
                  <SearchOutlined />
                </Button>
              }
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
