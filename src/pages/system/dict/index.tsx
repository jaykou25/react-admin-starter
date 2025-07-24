import {
  addDict,
  addDictDetail,
  delDict,
  delDictDetail,
  editDict,
  editDictDetail,
  queryDictDetail,
  queryDicts,
} from '@/apis/system'
import { hasPermission } from '@/utils'
import { FORM_TYPE_MAP } from '@/utils/constants'
import { Drawer, message } from 'antd'
import { useRef, useState } from 'react'
import { ProTable, Button } from 'react-admin-kit'

import { getDictColumns } from './columns'
import { getDictDetailColumns } from './dictDetailColumns'
import { PlusOutlined } from '@ant-design/icons'

const SystemDict = () => {
  const innerRef = useRef<any>()
  const actionRef = useRef<any>()

  const [visible, setVisible] = useState(false)
  const [selectedDict, setDict] = useState<any>({})

  const detailInnerRef = useRef<any>()
  const detailActionRef = useRef<any>()

  return (
    <div>
      <ProTable
        name="字典"
        innerRef={innerRef}
        actionRef={actionRef}
        columns={getDictColumns()}
        request={queryDicts}
        toolbar={{
          title: [
            <Button
              visible={() => hasPermission('dict:add')}
              key={1}
              type="primary"
              onClick={() => innerRef.current?.openModal('new')}
              icon={<PlusOutlined />}
            >
              新增
            </Button>,
          ],
        }}
        delFunction={(ids) => delDict(ids[0])}
        delPermission={() => hasPermission('dict:del')}
        onRow={(record) => ({
          onClick: () => {
            setDict(record)
            setVisible(true)
          },
        })}
        onFinish={async (values, formType, formData) => {
          if (formType === 'new') {
            await addDict(values)
          }

          if (formType === 'edit') {
            await editDict({ ...formData, ...values })
          }

          message.success(`${FORM_TYPE_MAP[formType]}成功!`)

          if (actionRef.current) {
            actionRef.current.reload()
          }

          return true
        }}
      />

      {/* 字典详情 */}
      <Drawer
        title="字典详情"
        open={visible}
        onClose={() => setVisible(false)}
        width={'45%'}
        destroyOnHidden
      >
        <ProTable
          name={`${selectedDict.name} - ${selectedDict.remark || ''}`}
          search={false}
          modalProps={{ confirmOnClose: false }}
          innerRef={detailInnerRef}
          actionRef={detailActionRef}
          request={(params) => {
            return new Promise((resolve) => {
              queryDictDetail({
                ...params,
                name: selectedDict.name,
              }).then((res) => {
                resolve({ data: res.items })
              })
            })
          }}
          columns={getDictDetailColumns()}
          delFunction={delDictDetail}
          toolbar={{
            title: [
              <Button
                key={1}
                type="primary"
                onClick={() => {
                  console.log('inner', detailInnerRef.current)
                  const defaultSort =
                    ((detailInnerRef.current.dataSource || []).length + 1) * 10
                  detailInnerRef.current?.openModal('new', {
                    sort: defaultSort,
                  })
                }}
                icon={<PlusOutlined />}
              >
                新增
              </Button>,
            ],
          }}
          onFinish={async (values, formType, formData) => {
            if (formType === 'new') {
              await addDictDetail({ ...values, dictId: selectedDict.id })
            } else {
              await editDictDetail({
                ...formData,
                ...values,
                dictId: selectedDict.id,
              })
            }

            message.success(`${formType === 'new' ? '新增' : '编辑'}成功!`)
            if (detailActionRef.current) {
              detailActionRef.current.reload()
            }

            return true
          }}
        />
      </Drawer>
    </div>
  )
}

export default SystemDict
