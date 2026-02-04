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
  DatePicker,
} from 'antd'
import { history, useModel, useLocation, useParams } from 'umi'
import {
  addInvestmentFlow,
  submitApproval,
  queryInvestmentFlowDetail,
  editInvestmentFlow,
} from '@/apis/test'
import dayjs from 'dayjs'

import DictSelect from '@/components/dict-select'
import { DatePickerProps } from 'antd/lib'

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

      const response = await queryInvestmentFlowDetail(id)

      if (response) {
        // 获取数据
        const data =
          typeof response === 'object' && response.data
            ? response.data
            : response

        if (data && typeof data === 'object') {
          // 直接构建表单数据对象
          const formData = {
            title: data.title || '',
            investYear: data.investYear || undefined,
            meetingType:
              data.meetingType &&
              typeof data.meetingType === 'string' &&
              data.meetingType.trim()
                ? data.meetingType.split(',').filter(Boolean)
                : [],
            content: data.content || '',
          }

          // 使用 setFieldsValue 一次性设置
          form.setFieldsValue(formData)
        }
      }
    } catch (error) {
      console.error('获取表单数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 从响应数据设置表单

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
        investYear: values.investYear
          ? String(values.investYear.format('YYYY'))
          : '',
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
        investYear: String(values.investYear.format('YYYY')),
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
            <Space
              style={{
                width: '100%',
                justifyContent: 'space-between', // 两端对齐
              }}
            >
              <Title level={4}>国联集团- 管理员发起的投资计划流程申请</Title>
              <Space>
                <Button onClick={handleBack}>返回</Button>
                <Button onClick={handleSave} loading={saving}>
                  {editId ? '更新' : '暂存'}
                </Button>
                <Button
                  type="primary"
                  onClick={handleSubmit}
                  loading={submitting}
                >
                  提交
                </Button>
              </Space>
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
            requiredMark={true}
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
                  label={<span>投资年度</span>}
                  name="investYear"
                  rules={[{ required: true, message: '请选择投资年度' }]}
                  style={{ marginBottom: 24 }}
                  getValueProps={(value) => {
                    // 当表单中 investYear 的值为数字时，将其转换为 dayjs 对象供 DatePicker 显示
                    return { value: value ? dayjs(`${value}-01-01`) : null }
                  }}
                >
                  <DatePicker
                    picker="year"
                    placeholder="请选择投资年度"
                    format="YYYY"
                    allowClear
                  ></DatePicker>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label={<span>会议类型</span>}
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
              label={<span>汇报内容</span>}
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
