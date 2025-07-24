import { message, Modal, Tabs } from 'antd'
import { useImperativeHandle, useRef, useState } from 'react'
import { ActionRefType, Button, ProTable } from 'react-admin-kit'
import { assignRole, cancelRole, getRoleUsers } from '../../apis'
import OrgTree from '../OrgTree'
import UserChoose from '../UserChoose'
import UserSearch from '../UserSearch'

const AssignModal = (props) => {
  const { innerRef } = props

  useImperativeHandle(innerRef, () => {
    return {
      openModal: (roleId, roleName) => {
        setRoleId(roleId)
        setAssignModalTitle(roleName)
        setAssignModalOpen(true)
      },
    }
  }, [])

  const actionRef = useRef<ActionRefType>()

  const [roleId, setRoleId] = useState()
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [assignModalTitle, setAssignModalTitle] = useState('')
  const [chooseModalLoading, setChooseModalLoading] = useState(false)
  const [chooseModalOpen, setChooseModalOpen] = useState(false)
  const [orgValue, setOrgValue] = useState<any>([])
  const [userValue, setUserValue] = useState<any>([])
  const [userSearchValue, setUserSearchValue] = useState<any>([])
  const [activeKey, setActiveKey] = useState('org')

  const resetValues = () => {
    setOrgValue([])
    setUserValue([])
    setUserSearchValue([])
  }

  return (
    <>
      <Modal
        destroyOnHidden
        width="90%"
        styles={{
          body: { maxHeight: 'calc(100vh - 240px)', overflow: 'auto' },
        }}
        title={assignModalTitle}
        open={assignModalOpen}
        onCancel={() => setAssignModalOpen(false)}
        okText="关闭弹窗"
        onOk={() => setAssignModalOpen(false)}
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <ProTable
          delFunction={(ids) =>
            cancelRole({
              type: 1,
              roleId,
              configList: ids,
            })
          }
          actionRef={actionRef}
          request={(params) => getRoleUsers({ ...params, roleId })}
          name="已绑定的人员"
          rowSelection={{}}
          toolbar={{
            title: (
              <div>
                <span style={{ marginRight: '20px' }}>已绑定的人员列表</span>
                <Button
                  key="choose"
                  type="primary"
                  onClick={() => setChooseModalOpen(true)}
                >
                  选择组织、人员进行绑定
                </Button>
              </div>
            ),
          }}
          defaultHideInSearch
          columns={[
            {
              title: '综合搜索',
              dataIndex: 'keyword',
              type: 'search',
              fieldProps: {
                placeholder: '输入人员或手机号',
              },
            },
            {
              title: '姓名',
              dataIndex: 'nickname',
            },
            {
              title: '组织',
              dataIndex: 'nickname',
              renderText: (_, record) => record.userInfo.orgName,
            },
            {
              title: '操作',
              width: 100,
              valueType: 'option',
              enableDelete: true,
              render: () => [],
            },
          ]}
        />
      </Modal>

      <Modal
        destroyOnHidden
        confirmLoading={chooseModalLoading}
        styles={{
          body: { maxHeight: 'calc(100vh - 240px)', overflow: 'auto' },
        }}
        width="80%"
        title="选择组织、人员"
        open={chooseModalOpen}
        onCancel={() => {
          setChooseModalOpen(false)
          resetValues()
        }}
        onOk={async () => {
          setChooseModalLoading(true)

          const type = activeKey === 'org' ? 2 : 1
          let ids

          if (activeKey === 'org') {
            ids = orgValue.checked
          } else if (activeKey === 'user') {
            ids = userValue.map((i) => i.value)
          } else {
            ids = userSearchValue.map((i) => i.value)
          }
          await assignRole({
            roleId,
            type,
            configList: ids,
          })
          message.success('绑定成功')

          setChooseModalLoading(false)
          setChooseModalOpen(false)
          resetValues()
          actionRef.current?.reload()
        }}
      >
        <Tabs
          activeKey={activeKey}
          onChange={setActiveKey}
          items={[
            {
              key: 'org',
              label: '按组织',
              children: <OrgTree value={orgValue} onChange={setOrgValue} />,
            },
            {
              key: 'user',
              label: '按人员',
              children: (
                <UserChoose
                  mode="multiple"
                  value={userValue}
                  onChange={setUserValue}
                />
              ),
            },
            {
              key: 'search',
              label: '人员综合搜索',
              children: (
                <UserSearch
                  mode="multiple"
                  value={userSearchValue}
                  onChange={setUserSearchValue}
                />
              ),
            },
          ]}
        />
      </Modal>
    </>
  )
}

export default AssignModal
