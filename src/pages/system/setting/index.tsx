import { addConfigs, delConfig, editConfig, queryConfigs } from '@/apis/system'
import { FORM_TYPE_MAP } from '@/utils/constants'
import { Button, message } from 'antd'
import { useRef } from 'react'
import { ProTable } from 'react-admin-kit'
import type { InnerRefType } from 'react-admin-kit'

import { getColumns } from './columns'
import { PlusOutlined } from '@ant-design/icons'

const SystemSetting = () => {
  const innerRef = useRef<InnerRefType>()
  const actionRef = useRef<any>()

  return (
    <ProTable
      size="small"
      name="参数配置"
      innerRef={innerRef}
      actionRef={actionRef}
      columns={getColumns()}
      request={() =>
        queryConfigs().then((res) => {
          return { data: res }
        })
      }
      toolbar={{
        title: [
          <Button
            key={1}
            type="primary"
            onClick={() => innerRef.current?.openModal('new')}
            icon={<PlusOutlined />}
          >
            新增
          </Button>,
        ],
      }}
      delFunction={(ids) => delConfig(ids[0])}
      onFinish={async (values, formType, formData) => {
        if (formType === 'new') {
          await addConfigs(values)
        }

        if (formType === 'edit') {
          await editConfig({ ...formData, ...values })
        }

        message.success(`${FORM_TYPE_MAP[formType]}成功!`)

        if (actionRef.current) {
          actionRef.current.reload()
        }

        return true
      }}
    />
  )
}

export default SystemSetting
