import { toRelative } from '@/utils'
import { queryInvestmentFlowList, deleteInvestmentFlow } from '@/apis/test'
import { message, Button, Space, Tabs } from 'antd'
import { useRef, useState, useEffect } from 'react'
import { PlusOutlined } from '@ant-design/icons'

import { InnerRefType, ProTable, ActionRefType } from 'react-admin-kit'

import { getColumns } from './columns'
import type { TabsProps } from 'antd'

function InvestmentFlow() {
  const [statusFilter, setStatusFilter] = useState<string>('2')
  const actionRef = useRef<ActionRefType>()
  const innerRef = useRef<InnerRefType>()

  const items: TabsProps['items'] = [
    {
      key: '2',
      label: '进行中',
    },
    {
      key: '1',
      label: '暂存中',
    },
    {
      key: '3',
      label: '项目完结',
    },
    {
      key: '4',
      label: '项目终止',
    },
    {
      key: '0',
      label: '已废弃',
    },
    {
      key: '',
      label: '全部',
    },
  ]

  // 处理状态筛选
  const handleStatusChange = (status: string) => {
    setStatusFilter(status)
    if (actionRef.current) {
      actionRef.current.reload()
    }
  }

  // 删除函数 - 修正类型
  const handleDelete = async (
    selectedIds: (string | number)[],
    record: any
  ) => {
    try {
      // 将 selectedIds 转换为字符串数组
      const idArray = selectedIds.map((id) => String(id))

      // 循环调用删除接口
      for (const id of idArray) {
        await deleteInvestmentFlow(id)
      }
      message.success('删除成功')
      actionRef.current?.reload()
      return true
    } catch (error) {
      message.error('删除失败')
      console.error('删除失败:', error)
      return false
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <ProTable
        defaultHideInSearch
        name="投资项目流程管理"
        search={{
          layout: 'horizontal',
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
              if (
                params[key] !== undefined &&
                params[key] !== null &&
                params[key] !== ''
              ) {
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

            const rawData = response?.data || []
            const total = response?.total || 0

            console.log(
              '🔍 rawData 类型:',
              typeof rawData,
              '长度:',
              rawData?.length
            )
            console.log('🔍 rawData 内容:', rawData)

            // 处理 meetingType 多值情况
            const processedData = rawData.map((item: any, index: number) => ({
              ...item,
              key: item.id || index,
              index:
                (queryParams.pageIndex - 1) * queryParams.pageSize + index + 1,
              meetingTypeDisplay:
                item.meetingTypeName || item.meetingType || '--',
            }))

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
        columns={getColumns()}
        delFunction={handleDelete}
        options={{
          fullScreen: true,
          reload: true,
          setting: true,
        }}
        scroll={{ x: 1500 }}
        style={{
          backgroundColor: '#fff',
          borderRadius: '6px',
        }}
        toolbar={{
          title: [
            <div
              key="actions"
              style={{
                marginBottom: 16,
                textAlign: 'right',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <Button
                key="add"
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  toRelative('form')
                }}
              >
                新增
              </Button>

              <Tabs
                activeKey={statusFilter}
                onChange={handleStatusChange}
                size="middle"
                tabBarGutter={24}
                styles={{}}
                items={items}
              ></Tabs>
            </div>,
          ],
        }}
        rowSelection={{}}
      />
    </div>
  )
}

export default InvestmentFlow
