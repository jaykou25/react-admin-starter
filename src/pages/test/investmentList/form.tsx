import React, { useState, useEffect } from 'react'
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Space,
  Typography,
  Row,
  Col,
  Spin,
} from 'antd'
import { history, useModel, useLocation, useParams } from 'umi'
import {
  addInvestmentFlow,
  submitApproval,
  queryInvestmentFlowDetail,
  editInvestmentFlow,
} from '@/apis/test'

import DictSelect from '@/components/dict-select'

const { Title } = Typography
const { TextArea } = Input
const { Option } = Select

const InvestmentFormPage: React.FC = () => {
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const { initialState } = useModel('@@initialState')
  const { currentUser } = initialState || {}
  const { userInfo } = currentUser || {}
  const location = useLocation()
  const params = useParams<{ id?: string }>()

  // 从路由参数或查询参数获取ID
  useEffect(() => {
    const id = params.id || new URLSearchParams(location.search).get('id')
    if (id) {
      setEditId(id)
      fetchFormData(id)
    } else {
      // 新增时设置默认值
      form.setFieldsValue({
        meetingType: ['1', '2'],
      })
    }
  }, [location, params])

  // 获取表单数据
  const fetchFormData = async (id: string) => {
    try {
      setLoading(true)
      console.log('开始获取数据，ID:', id)

      const response = await queryInvestmentFlowDetail(id)
      console.log('接口返回的完整响应:', response)
      console.log('响应类型:', typeof response)
      console.log('响应是否为null:', response === null)
      console.log('响应是否为undefined:', response === undefined)

      // 简化判断逻辑
      if (response) {
        console.log('响应存在，检查结构...')

        // 如果响应是对象，检查是否有必要的字段
        if (typeof response === 'object') {
          // 检查是否有 data 字段
          if (response.data) {
            console.log('响应包含data字段:', response.data)
            setFormDataFromResponse(response.data)
          } else {
            // 如果响应本身就是数据对象
            console.log('响应没有data字段，使用响应本身作为数据')
            setFormDataFromResponse(response)
          }
        } else {
          console.log('响应不是对象，无法处理:', response)
        }
      } else {
        console.log('接口返回空响应')
      }
    } catch (error) {
      console.error('获取表单数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 从响应数据设置表单
  const setFormDataFromResponse = (data: any) => {
    try {
      console.log('开始处理数据:', data)
      console.log('数据类型:', typeof data)
      console.log('数据是否为null:', data === null)
      console.log('数据是否为undefined:', data === undefined)
      console.log('数据键名:', Object.keys(data || {}))

      if (!data) {
        console.log('数据为空')
        return
      }

      // 准备表单数据对象
      const formData: Record<string, any> = {}

      // 逐个字段处理
      const fields = ['title', 'investYear', 'meetingType', 'content']
      fields.forEach((field) => {
        console.log(
          `处理字段 ${field}:`,
          data[field],
          '类型:',
          typeof data[field]
        )

        switch (field) {
          case 'title':
            formData.title = data.title || ''
            break
          case 'investYear':
            if (data.investYear !== undefined && data.investYear !== null) {
              formData.investYear = Number(data.investYear)
            } else {
              formData.investYear = undefined
            }
            break
          case 'meetingType':
            if (
              data.meetingType &&
              typeof data.meetingType === 'string' &&
              data.meetingType.trim() !== ''
            ) {
              formData.meetingType = data.meetingType.split(',').filter(Boolean)
            } else {
              formData.meetingType = []
            }
            break
          case 'content':
            formData.content = data.content || ''
            break
        }
      })

      console.log('最终的表单数据:', formData)

      // 尝试设置表单值
      if (Object.keys(formData).length > 0) {
        form.setFieldsValue(formData)
        console.log('表单设置完成，当前值:', form.getFieldsValue())
      } else {
        console.log('没有可设置的表单数据')
      }
    } catch (error) {
      console.error('设置表单数据失败:', error)
    }
  }

  const handleBack = () => {
    history.push('/test/investmentList')
  }

  const handleSave = async () => {
    try {
      const values = await form.getFieldsValue()
      setSaving(true)

      const saveData = {
        ...(editId && { id: editId }),
        title: values.title || '',
        investYear: values.investYear ? String(values.investYear) : '',
        meetingType: values.meetingType ? values.meetingType.join(',') : '',
        content: values.content || '',
        companyName: '国联集团',
      }

      console.log('保存的数据:', saveData)

      if (editId) {
        await editInvestmentFlow(saveData)
      } else {
        await addInvestmentFlow(saveData)
      }

      handleBack()
    } catch (error: any) {
      console.error('操作失败:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setSubmitting(true)

      console.log('表单验证通过的数据:', values)

      const submitData = {
        ...(editId && { id: editId }),
        title: values.title,
        investYear: String(values.investYear),
        meetingType: values.meetingType.join(','),
        content: values.content,
        orgId: userInfo?.orgId,
        candidateList: [],
        companyName: userInfo?.companyName,
      }

      console.log('提交的数据:', submitData)

      await submitApproval(submitData)

      setTimeout(() => {
        history.push('/test/investmentList')
      }, 1500)
    } catch (error: any) {
      console.error('提交失败:', error)
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
      <Spin spinning={loading} tip="加载中...">
        <Card>
          <div>
            <Space>
              <Title level={4}>国联集团- 管理员发起的投资计划流程申请</Title>
              <Button onClick={handleBack}>返回</Button>
              <Button onClick={handleSave} loading={saving}>
                {editId ? '更新' : '暂存'}
              </Button>
              <Button
                type="primary"
                onClick={handleSubmit}
                loading={submitting}
              >
                {editId ? '提交' : '提交'}
              </Button>
            </Space>
          </div>

          <div style={{ marginTop: 24 }}>
            <div
              style={{
                borderLeft: '4px solid #1890ff',
                paddingLeft: 12,
                marginBottom: 16,
              }}
            >
              <Title level={5} style={{ margin: 0 }}>
                基本信息
              </Title>
            </div>
          </div>

          <Form
            form={form}
            layout="horizontal"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 18 }}
            requiredMark={false}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="流程标题"
                  name="title"
                  rules={[{ required: true, message: '请输入流程标题' }]}
                  style={{ marginBottom: 24 }}
                >
                  <Input placeholder="请输入流程标题" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={
                    <span>
                      <span style={{ color: '#ff4d4f', marginRight: 4 }}>
                        *
                      </span>
                      投资年度
                    </span>
                  }
                  name="investYear"
                  rules={[{ required: true, message: '请选择投资年度' }]}
                  style={{ marginBottom: 24 }}
                >
                  <Select placeholder="请选择投资年度" allowClear>
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

            <Form.Item
              label={
                <span>
                  <span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>
                  会议类型
                </span>
              }
              name="meetingType"
              rules={[{ required: true, message: '请选择会议类型' }]}
              style={{ marginBottom: 24 }}
              labelCol={{ span: 2 }}
              wrapperCol={{ span: 20 }}
            >
              <DictSelect
                type="regulation_meeting_type" // 会议类型字典类型
                mode="multiple"
                placeholder="请选择会议类型"
                style={{ width: '100%', maxWidth: 400 }}
                allowClear
              />
            </Form.Item>

            <Form.Item
              label={
                <span>
                  <span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>
                  汇报内容
                </span>
              }
              name="content"
              rules={[{ required: true, message: '请输入汇报内容' }]}
              style={{ marginBottom: 24 }}
              labelCol={{ span: 2 }}
              wrapperCol={{ span: 20 }}
            >
              <TextArea
                placeholder="请输入汇报内容"
                rows={8}
                showCount
                maxLength={5000}
              />
            </Form.Item>
          </Form>
        </Card>
      </Spin>
    </div>
  )
}

export default InvestmentFormPage
