import { useState, useEffect } from 'react'
import {
  Card,
  Descriptions,
  Spin,
  Alert,
  Table,
  Tag,
  Space,
  Button,
} from 'antd'
import { toRelative } from '@/utils'

import { queryInvestmentFlowDetail } from '@/apis/test'
import { history } from 'umi'
import { DescriptionsProps } from 'antd/lib'

interface InvestmentDetail {
  id: number
  billCode: string | null
  title: string
  meetingType: string
  meetingTypeName: string
  investYear: number | null
  content: string
  status: number
  currentNodeName: string | null
  submitTime: string | null
  companyName: string
  tasksList: any[] | null
  createUserName: string
  instanceId: string | null
  createTime: string
  closeTime: string | null
  finishTime: string | null
}

export default function InvestmentFlowDetail() {
  const [loading, setLoading] = useState(true)
  const [detailData, setDetailData] = useState<InvestmentDetail | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const handleBack = () => {
    history.push('/test/investmentList')
  }
  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: '单据编号',
      children: detailData?.billCode || '--',
    },
    {
      key: '2',
      label: '计划标题',
      children: detailData?.title || '--',
    },
    {
      key: '3',
      label: '投资年份',
      children: detailData?.investYear || '--',
    },
    {
      key: '4',
      label: '会议类型',
      children: detailData?.meetingTypeName || '--',
    },
    {
      key: '5',
      label: '当前节点',
      children: detailData?.currentNodeName || '--',
    },
    {
      key: '6',
      label: '所属公司',
      children: detailData?.companyName || '--',
    },
    {
      key: '7',
      label: '创建人',
      children: detailData?.createUserName || '--',
    },
    {
      key: '8',
      label: '创建时间',
      children: detailData?.createTime || '--',
    },
    {
      key: '9',
      label: '提交时间',
      children: detailData?.submitTime || '--',
    },
    {
      key: '10',
      label: '完结时间',
      children: detailData?.finishTime || '--',
    },
    {
      key: '11',
      label: '终止时间',
      children: detailData?.closeTime || '--',
    },
    {
      key: '12',
      label: '流程实例ID',
      children: detailData?.instanceId || '--',
    },
    {
      key: '13',
      label: '计划内容',
      children: detailData?.content || '--',
    },
  ]

  //  获取URL中的ID
  const getUrlId = () => {
    const id = new URLSearchParams(window.location.search).get('id')
    return id && id.trim() ? id : null
  }

  const fetchDetail = async () => {
    const id = getUrlId()
    if (!id) {
      setErrorMsg('未获取到有效的数据ID')
      setLoading(false)
      return
    }

    try {
      // 调用接口（接口直接返回详情对象，无外层包装）
      const res = await queryInvestmentFlowDetail(id)

      // 仅判断是否有ID字段即可（接口返回有效数据的标志）
      if (res && res.id) {
        setDetailData(res)
        setErrorMsg('')
      } else {
        setErrorMsg('未查询到对应ID的详情数据')
      }
    } catch (err) {
      console.error('请求详情失败:', err)
      setErrorMsg('网络异常，请刷新重试')
    } finally {
      setLoading(false)
    }
  }

  // 页面加载时请求
  useEffect(() => {
    fetchDetail()
  }, [])

  // 任务列表列配置
  const taskColumns = [
    { title: '节点名称', dataIndex: 'processNodeName', key: 'processNodeName' },

    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (t) => t || '--',
    },
    {
      title: '完成时间',
      dataIndex: 'doneTime',
      key: 'doneTime',
      render: (t) => t || '--',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) =>
        record.redirectUrl ? (
          <Button
            type="link"
            onClick={() => window.open(record.redirectUrl, '_blank')}
          >
            跳转处理
          </Button>
        ) : (
          <span style={{ color: '#999' }}>--</span>
        ),
    },
  ]

  // 正常渲染详情
  return (
    <Card style={{ margin: 16, borderRadius: 6 }}>
      {/* 头部 */}
      <Space
        style={{
          marginBottom: 20,
          justifyContent: 'space-between',
          display: 'flex',
        }}
      >
        <h3 style={{ margin: 0 }}>投资项目流程详情</h3>
        <Space>
          <Button onClick={handleBack}>返回列表</Button>
        </Space>
      </Space>

      {/* 基本信息 */}
      <div style={{ marginBottom: 20 }}>
        <Descriptions
          column={3}
          size="middle"
          title="基本信息"
          items={items}
        ></Descriptions>
      </div>

      {/* 任务节点 */}
      <div>
        <h4 style={{ margin: 0, marginBottom: 16 }}>流程任务节点</h4>
        {detailData?.tasksList && detailData?.tasksList.length > 0 ? (
          <Table
            columns={taskColumns}
            dataSource={detailData?.tasksList}
            rowKey={(item) => item.id || `node-${item.sort}`}
            pagination={false}
            size="middle"
            scroll={{ x: 800 }}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: 20, color: '#999' }}>
            暂无任务节点数据
          </div>
        )}
      </div>
    </Card>
  )
}
