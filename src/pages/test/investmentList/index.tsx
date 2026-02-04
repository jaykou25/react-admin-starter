import { toRelative } from '@/utils'
import { queryInvestmentFlowList, deleteInvestmentFlow } from '@/apis/test'
import { message, Button, Tabs } from 'antd'
import { useRef, useState } from 'react'
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

  return (
    <div style={{ padding: 16 }}>
      <ProTable
        defaultHideInSearch
        name="投资项目流程管理"
        search={{
          layout: 'horizontal',
        }}
        headerTitle={false}
        actionRef={actionRef}
        innerRef={innerRef}
        request={async (params) => {
          const queryParams = {
            ...params,
            status: statusFilter,
          }

          return await queryInvestmentFlowList(queryParams)
        }}
        columns={getColumns()}
        delFunction={deleteInvestmentFlow}
        options={{
          fullScreen: true,
          reload: true,
          setting: true,
        }}
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
      />
    </div>
  )
}

export default InvestmentFlow
