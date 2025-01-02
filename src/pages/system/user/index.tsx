import { addUser, delUser, editUser, syncUsers, queryUsersAll } from '@/apis'
import { message } from 'antd'
import { useRef, useState } from 'react'
import { SyncOutlined } from '@ant-design/icons'
import { getColumns } from './columns'

import { InnerRefType, ProTable, Button, ActionRefType } from 'react-admin-kit'
import { hasPermission } from '@/utils'

function User() {
  const [syncUsersLoading, setSyncUsersLoading] = useState(false)

  const actionRef = useRef<ActionRefType>()
  const innerRef = useRef<InnerRefType>()

  const handleUserSync = () => {
    setSyncUsersLoading(true)
    syncUsers()
      .then(() => {
        message.success('同步成功!')
      })
      .finally(() => {
        setSyncUsersLoading(false)
      })
  }

  return (
    <div>
      <ProTable
        defaultHideInSearch
        name="用户"
        search={{ layout: 'vertical' }}
        headerTitle={false}
        actionRef={actionRef}
        innerRef={innerRef}
        request={queryUsersAll}
        columns={getColumns()}
        delFunction={(ids) => delUser(ids[0])}
        delPermission={() => hasPermission('user:del')}
        options={false}
        toolbar={{
          title: [
            !1 && (
              <Button
                key={2}
                visible={() => hasPermission('user:sync')}
                loading={syncUsersLoading}
                danger
                type="primary"
                icon={<SyncOutlined />}
                onClick={handleUserSync}
              >
                同步
              </Button>
            ),
          ],
        }}
        onFinish={async (values, formType, formData) => {
          if (formType === 'new') {
            await addUser({
              ...values,
            })
          } else {
            await editUser({
              ...values,
              id: formData.id,
            })
          }

          if (actionRef.current) {
            actionRef.current.reload()
          }

          return true
        }}
      />
    </div>
  )
}

export default User
