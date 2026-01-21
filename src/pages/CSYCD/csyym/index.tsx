import { toRelative } from '@/utils';
import {
  queryInvestmentFlowList,
  addInvestmentFlow,
  editInvestmentFlow,
  deleteInvestmentFlow,
} from '@/apis/CSYCD'
import { message, Button, Space } from 'antd'
import { useRef, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { FLOW_STATUS_OPTIONS } from '@/apis/CSYCD'
import { InnerRefType, ProTable, ActionRefType } from 'react-admin-kit'
import { hasPermission } from '@/utils'
import { getColumns } from './columns'  

function InvestmentFlow() {
  const [statusFilter, setStatusFilter] = useState<string>('')
  const actionRef = useRef<ActionRefType>()
  const innerRef = useRef<InnerRefType>()

  // 处理状态筛选
  const handleStatusChange = (status: string) => {
    setStatusFilter(status)
    if (actionRef.current) {
      actionRef.current.reload()
    }
  }

  return (
    <div style={{ padding: 16 }}>
      {/* 状态筛选按钮组 */}
      

      <ProTable
        defaultHideInSearch
        name="投资项目流程管理"
        search={{
          layout: 'vertical',
          defaultCollapsed: true,
          span: 8,
          labelWidth: 'auto',
          searchText: '查询',
          resetText: '重置',
          collapseRender: (collapsed, _, __, toggleCollapsed) => {
            return (
              <Button
                type="link"
                onClick={toggleCollapsed}
                style={{ padding: 0, color: '#1890ff' }}
              >
                {collapsed ? '展开' : '收起'}
              </Button>
            )
          },
        }}
        headerTitle={false}
        actionRef={actionRef}
        innerRef={innerRef}
        pagination={{
          pageSize: 10,
          pageSizeOptions: ['10', '20', '50', '100'],
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
        request={async (params) => {
          try {
            // 构建查询参数
            const queryParams: any = {
              pageIndex: params.current || 1,
              pageSize: params.pageSize || 10,
            }

            // 映射字段
            const fieldMapping = {
              title: 'title',
              billCode: 'billCode',
              currentNodeName: 'currentNodeName',
              investYear: 'investYear',
              meetingType: 'meetingType',
              createUserName: 'createUserName',
              orgName: 'orgName',
              submitTime: 'submitTime',
            }

            // 复制搜索参数
            Object.entries(fieldMapping).forEach(([key, apiKey]) => {
              if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                queryParams[apiKey] = params[key]
              }
            })

            // 添加状态筛选参数
            if (statusFilter) {
              queryParams.status = statusFilter
            }

            console.log('📡 API请求参数:', queryParams)
            const response = await queryInvestmentFlowList(queryParams)
            
            console.log('📥 API完整响应:', response)
            
            // ✅ 关键修正：根据你的API响应结构调整
            // 图片显示API直接返回 { data: Array(10), total: 60, ... }
            // 不是嵌套的 response.data.data
            
            const rawData = response?.data || []  // 直接取 response.data（这是数组）
            const total = response?.total || 0     // 直接取 response.total
            
            console.log('🔍 rawData 类型:', typeof rawData, '长度:', rawData?.length)
            console.log('🔍 rawData 内容:', rawData)
            
            // ✅ 关键：处理 meetingType 多值情况
            const processedData = rawData.map((item: any, index: number) => ({
              ...item,
              key: item.id || index,  // ProTable需要唯一key
              index: ((queryParams.pageIndex - 1) * queryParams.pageSize) + index + 1,
              // 处理 meetingType 显示
              meetingTypeDisplay: item.meetingTypeName || item.meetingType || '--',
            }))
            
            // ✅ 成功判断：检查是否有数据返回
            const success = Array.isArray(rawData)
            
            console.log('✅ 成功状态:', success)
            console.log('✅ 数据总数:', total)
            console.log('✅ 数据条数:', processedData.length)
            console.log('📊 处理后第一条数据:', processedData[0])
            
            return {
              data: processedData,
              total: total,
              success: success,
            }
          } catch (error) {
            console.error('❌ 请求失败:', error)
            message.error('获取数据失败')
            return {
              data: [],
              total: 0,
              success: false,
            }
          }
        }}
        columns={getColumns()}  // ✅ 使用合并的列配置
        delFunction={(ids) => deleteInvestmentFlow(ids[0])}
        delPermission={() => hasPermission('investment:delete')}
        options={{
          density: true,
          fullScreen: true,
          reload: true,
          setting: true,
        }}
        scroll={{ x: 1500 }}
        style={{
          minWidth: '100%',
          backgroundColor: '#fff',
          borderRadius: '6px',
        }}
         toolbar={{
    title: [
      <div key="actions" style={{ marginBottom: 16, textAlign: 'right' }}>
        <Button
          key="add"
          visible={() => hasPermission('investment:add')}
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            
            toRelative('form');
          }}
        >
          新增
        </Button>
      </div>,<div
        style={{
          marginBottom: 16,
          padding: '12px 16px',
          backgroundColor: '#fff',
          borderRadius: 6,
          border: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontWeight: 500,
            color: 'rgba(0, 0, 0, 0.85)',
            marginRight: 16,
            whiteSpace: 'nowrap',
          }}
        >
          流程状态:
        </span>
        <Space size={[8, 8]} wrap>
         
          {FLOW_STATUS_OPTIONS.map((option) => (
            <Button
              key={option.value}
              type={statusFilter === option.value.toString() ? 'primary' : 'default'}
              onClick={() => handleStatusChange(option.value.toString())}
              size="small"
            >
              {option.label}
            </Button>
          ))}
        </Space>
      </div>
    ],
  }}
      />
    </div>
  )
}

export default InvestmentFlow