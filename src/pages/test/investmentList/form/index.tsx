// src/pages/test/InvestmentFormPage/index.tsx
import React, { useState, useEffect, useRef } from 'react'
import { Card, Button, Space, Typography, Spin } from 'antd'
import { history, useModel, useLocation, useParams } from 'umi'
import { SchemaForm, ProFormInstance } from 'react-admin-kit'
import {
  addInvestmentFlow,
  submitApproval,
  queryInvestmentFlowDetail,
  editInvestmentFlow,
} from '@/apis/test'
import dayjs from 'dayjs'
import { columns } from './columns'

const { Title } = Typography

const InvestmentFormPage: React.FC = () => {
  const formRef = useRef<ProFormInstance>()
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
      formRef.current?.setFieldsValue({
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
        const data =
          typeof response === 'object' && response.data
            ? response.data
            : response

        if (data && typeof data === 'object') {
          const formData = {
            title: data.title || '',
            // 注意：这里不直接转换，让 columns 中的 convertValue 处理
            investYear: data.investYear || undefined,
            meetingType:
              data.meetingType &&
              typeof data.meetingType === 'string' &&
              data.meetingType.trim()
                ? data.meetingType.split(',').filter(Boolean)
                : [],
            content: data.content || '',
          }

          formRef.current?.setFieldsValue(formData)
        }
      }
    } catch (error) {
      console.error('获取表单数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    history.push('/test/investmentList')
  }

  const transformFormData = (values: any) => {
    const { investYear, meetingType, ...rest } = values

    return {
      ...(editId && { id: editId }),
      investYear: investYear?.$y,
      meetingType: Array.isArray(meetingType)
        ? meetingType.join(',')
        : meetingType,
      ...rest,
      orgId: userInfo?.orgId,
      candidateList: [],
      companyName: userInfo?.companyName,
    }
  }

  const handleSave = async () => {
    try {
      const values = await formRef.current?.getFieldsValue()
      if (!values) return

      setSaving(true)
      const saveData = transformFormData(values)
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
      const values = await formRef.current?.validateFields()
      if (!values) return

      setSubmitting(true)
      console.log('表单验证通过的数据:', values)
      const submitData = transformFormData(values)
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

  // SchemaForm 的 onFinish
  const onFinish = async (values: any) => {
    try {
      setSubmitting(true)
      const submitData = transformFormData(values)
      console.log('表单提交数据:', submitData)

      await submitApproval(submitData)

      setTimeout(() => {
        history.push('/test/investmentList')
      }, 1500)
    } catch (error) {
      console.error('提交失败:', error)
      throw error // 重新抛出错误，让表单知道提交失败
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
                justifyContent: 'space-between',
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

          <SchemaForm
            name="investment-form"
            onFinish={onFinish}
            formRef={formRef}
            columns={columns}
            layout="horizontal"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 18 }}
            requiredMark={true}
            autoFocusFirstInput={false}
            grid={true}
            rowProps={{
              gutter: 16,
            }}
            initialValues={{
              meetingType: ['1', '2'],
            }}
            // 防止表单自动重置
            isKeyPressSubmit={false}
            style={{
              marginTop: 24,
            }}
          />
        </Card>
      </Spin>
    </div>
  )
}

export default InvestmentFormPage
