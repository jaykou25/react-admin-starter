import { addUser, delUser, editUser, syncUsers, queryUsersAll } from '@/apis'
import { message } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { PlusOutlined, SyncOutlined } from '@ant-design/icons'
import { getColumns } from './columns'

import { InnerRefType, ProTable, Button, ActionRefType } from 'react-admin-kit'
import { hasPermission } from '@/utils'
import { encrypt } from '@/utils/jsencrypt'

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
        name="用户"
        search={{ layout: 'vertical' }}
        headerTitle={false}
        actionRef={actionRef}
        innerRef={innerRef}
        // rowSelection={{}}
        request={queryUsersAll}
        columns={getColumns()}
        delFunction={(ids) => delUser(ids[0])}
        delPermission={() => hasPermission('user:del')}
        options={false}
        toolbar={{
          // search: (
          //   <BusinessTreeSelect
          //     type="allDept"
          //     placeholder="选择组织过滤"
          //     style={{ width: "300px" }}
          //     onChange={(value) => {
          //       setDeptId(value);
          //     }}
          //   />
          // ),
          title: [
            // <Button
            //   // visible={() => hasPermission('user:add')}
            //   key={1}
            //   type="primary"
            //   onClick={() =>
            //     innerRef.current?.openModal('new', {
            //       enabled: true,
            //       // dept: { id: deptId },
            //     })
            //   }
            // >
            //   <PlusOutlined /> 新增
            // </Button>,
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
        // initialValues={{
        //   ...formData.defaultValue,
        //   deptId: formData.defaultValue.dept?.id,
        //   roleIds: defaultRoleIds,
        // }}
        onFinish={async (values, formType, formData) => {
          if (formType === 'new') {
            await addUser({
              ...values,
              // password: encrypt(values.password)
            })
          } else {
            await editUser({
              ...values,
              // password: encrypt(values.password),
              // passwordConfirm: encrypt(values.password),
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
