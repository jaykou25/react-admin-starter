import { Component, createRef } from 'react'
import {
  Row,
  Col,
  Space,
  Tag,
  Card,
  Tree,
  message,
  Popconfirm,
  Input,
  Modal,
  Tabs,
  Tooltip,
} from 'antd'
import ProList from '@ant-design/pro-list'
import {
  addRole,
  delRoles,
  editRole,
  queryMenusTree,
  queryRole,
  queryRoles,
  saveRoleMenus,
} from '@/apis/system'
import { assignRole, cancelRole, getRoleUsers } from './apis'
import styles from './styles.less'
import { getRoleColumns } from './columns'
import { ModalForm, LinkButton, Button, ProTable } from 'react-admin-kit'
import { hasPermission } from '@/utils'
import { normalizeTree } from '@/utils/treeUtil'
import OrgTree from './components/OrgTree'
import UserChoose from './components/UserChoose'
import UserSearch from './components/UserSearch'

class Role extends Component<any, any> {
  private actionRef
  private roleId

  constructor(props) {
    super(props)

    this.state = {
      roleData: [],
      showRoleData: [],
      roleLoading: false,
      selectedRoleId: null,
      formVisible: false,
      formType: 'new',
      formData: {},

      treeData: [],
      checkedKeys: [],
      saveRoleMenusLoading: false,

      assignModalOpen: false,
      assignModalTitle: '',
      assignModalLoading: false,
      chooseModalOpen: false,
      orgValue: [],
      userValue: [],
      userSearchValue: [],
      activeKey: 'org',
    }

    this.actionRef = createRef()
    this.roleId = undefined
  }

  componentDidMount() {
    // 请求角色列表
    this.handleQueryRoles()

    // 请求菜单列表
    queryMenusTree().then((res) => {
      const treeData = normalizeTree(res, (item) => ({
        title: item.name,
        key: item.id,
      }))
      this.setState({ treeData })
    })
  }

  handleQueryRoles = () => {
    this.setState({ roleLoading: true })
    // queryRoles({ sort: ["level,asc", "createTime,desc"], pageSize: 200 })
    queryRoles()
      .then((res) => {
        this.setState({ roleData: res, showRoleData: res })
      })
      .finally(() => {
        this.setState({ roleLoading: false })
      })
  }

  handleSubmitValue = (values) => {
    const { formData } = this.state
    const { depts = [], deptsPartys, ...rest } = values
    const $depts = depts.map((id) => ({ id }))
    const $deptsPartys = deptsPartys.map((id) => ({ id }))
    return { ...formData, ...rest, depts: $depts, deptsPartys: $deptsPartys }
  }

  handleDeleteRole = (id) => {
    delRoles(id).then(() => {
      message.success('删除成功!')
      this.handleQueryRoles()
    })
  }

  // 分配菜单
  handleSaveRoleMenus = () => {
    const { selectedRoleId, checkedKeys } = this.state
    const data = {
      id: selectedRoleId,
      permissionIds: checkedKeys,
    }

    this.setState({ saveRoleMenusLoading: true })
    saveRoleMenus(data)
      .then(() => {
        message.success('保存成功!')
        // this.syncRole(selectedRoleId);
        this.handleQueryRoles()
      })
      .finally(() => {
        this.setState({ saveRoleMenusLoading: false })
      })
  }

  syncRole = (id) => {
    queryRole(id).then((res) => {
      const $data = this.state.roleData
      const index = $data.findIndex((row) => row.id === id)
      $data.splice(index, 1, res)
      this.setState({ roleData: $data, showRoleData: $data })
    })
  }

  onRoleNameChange = (val) => {
    const { roleData } = this.state

    if (!val) {
      this.setState({
        showRoleData: roleData,
      })

      return
    }

    const showRoleData = roleData.filter((item) => item.name.includes(val))

    this.setState({ showRoleData })
  }

  render() {
    const {
      roleLoading,
      treeData,
      selectedRoleId,
      checkedKeys,
      formVisible,
      formType,
      formData,
      saveRoleMenusLoading,
      showRoleData,
    } = this.state
    return (
      <Row gutter={24}>
        <Col span={24} lg={12} style={{ marginBottom: '24px' }}>
          <Input.Search
            style={{ marginBottom: '10px' }}
            placeholder="模糊搜索"
            onSearch={this.onRoleNameChange}
          />
          <ProList
            loading={roleLoading}
            className={styles.roleList}
            rowKey="id"
            headerTitle="角色列表"
            tooltip="给角色分配菜单"
            toolbar={{
              actions: [
                <Button
                  key="add"
                  visible={() => hasPermission('roles:add')}
                  type="primary"
                  onClick={() =>
                    this.setState({
                      formVisible: true,
                      formData: {},
                      formType: 'new',
                    })
                  }
                >
                  新增角色
                </Button>,
              ],
            }}
            dataSource={showRoleData}
            // showActions="hover"
            metas={{
              title: { dataIndex: 'name' },
              subTitle: {
                render: (text, record) => {
                  return (
                    <Space size={0}>
                      {record.status === 0 && <Tag color="blue">禁用</Tag>}
                    </Space>
                  )
                },
              },
              type: {
                // 选中的行会加上类.ant-pro-list-row-type-selected
                render: (text, record) =>
                  record.id === selectedRoleId ? 'selected' : '',
              },
              actions: {
                render: (text, row) => [
                  <Tooltip key="assign" title="将组织或人员绑定至该角色">
                    <LinkButton
                      visible={() => hasPermission('roles:edit')}
                      key="assign"
                      onClick={() => {
                        this.roleId = row.id
                        this.setState({
                          assignModalOpen: true,
                          assignModalTitle: row.name,
                        })
                      }}
                    >
                      分配
                    </LinkButton>
                  </Tooltip>,
                  <LinkButton
                    visible={() => hasPermission('roles:edit')}
                    key="warning"
                    onClick={() =>
                      this.setState({
                        formVisible: true,
                        formData: row,
                        formType: 'edit',
                      })
                    }
                  >
                    编辑
                  </LinkButton>,
                  <Popconfirm
                    key={2}
                    title="确认删除该角色吗?"
                    onConfirm={() => this.handleDeleteRole(row.id)}
                  >
                    <LinkButton
                      danger
                      key="view"
                      visible={() => hasPermission('roles:del')}
                    >
                      删除
                    </LinkButton>
                  </Popconfirm>,
                ],
              },
            }}
            onRow={(record) => ({
              onClick: () => {
                const menuIds = record.permissionIds || []
                this.setState({
                  selectedRoleId: record.id,
                  checkedKeys: menuIds,
                })
              },
            })}
          />
          <ModalForm
            columns={getRoleColumns()}
            // modal参数
            title={formType === 'new' ? '新增角色' : '编辑角色'}
            width="520px"
            open={formVisible}
            onCancel={() => this.setState({ formVisible: false })}
            // 表单初始值
            formProps={{
              initialValues: {
                ...formData,
              },
            }}
            // 表单验证成功后的回调
            onFinish={async (values) => {
              if (formType === 'new') {
                await addRole(values)
              } else {
                await editRole({
                  ...values,
                  id: formData.id,
                })
              }

              message.success(`${formType === 'new' ? '新增' : '编辑'}成功!`)
              this.handleQueryRoles()
              return true
            }}
          />

          <Modal
            destroyOnHidden
            width="90%"
            // style={{ top: 48 }}
            styles={{
              body: { maxHeight: 'calc(100vh - 240px)', overflow: 'auto' },
            }}
            title={this.state.assignModalTitle}
            open={this.state.assignModalOpen}
            onCancel={() => this.setState({ assignModalOpen: false })}
            cancelText="关闭弹窗"
            okButtonProps={{ style: { display: 'none' } }}
          >
            <ProTable
              delFunction={(ids) =>
                cancelRole({
                  type: 1,
                  roleId: this.roleId,
                  configList: ids,
                })
              }
              actionRef={this.actionRef}
              request={(params) =>
                getRoleUsers({ ...params, roleId: this.roleId })
              }
              name="已绑定的人员"
              rowSelection={{}}
              toolbar={{
                title: (
                  <div>
                    <span style={{ marginRight: '20px' }}>
                      已绑定的人员列表
                    </span>
                    <Button
                      key="choose"
                      type="primary"
                      onClick={() => this.setState({ chooseModalOpen: true })}
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
            confirmLoading={this.state.assignModalLoading}
            // style={{ top: 48 }}
            styles={{
              body: { maxHeight: 'calc(100vh - 240px)', overflow: 'auto' },
            }}
            width="80%"
            title="选择组织、人员"
            open={this.state.chooseModalOpen}
            onCancel={() => {
              this.setState({
                chooseModalOpen: false,
                orgValue: [],
                userValue: [],
                userSearchValue: [],
              })
            }}
            onOk={async () => {
              this.setState({ assignModalLoading: true })
              const { activeKey, orgValue, userValue, userSearchValue } =
                this.state
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
                roleId: this.roleId,
                type,
                configList: ids,
              })
              message.success('绑定成功')
              this.setState({
                assignModalLoading: false,
                chooseModalOpen: false,
                orgValue: [],
                userValue: [],
                userSearchValue: [],
              })
              this.actionRef.current.reload()
            }}
          >
            <Tabs
              activeKey={this.state.activeKey}
              onChange={(key) => this.setState({ activeKey: key })}
              items={[
                {
                  key: 'org',
                  label: '按组织',
                  children: (
                    <OrgTree
                      value={this.state.orgValue}
                      onChange={(vals) => this.setState({ orgValue: vals })}
                    />
                  ),
                },
                {
                  key: 'user',
                  label: '按人员',
                  children: (
                    <UserChoose
                      mode="multiple"
                      value={this.state.userValue}
                      onChange={(vals) => this.setState({ userValue: vals })}
                    />
                  ),
                },
                {
                  key: 'search',
                  label: '人员综合搜索',
                  children: (
                    <UserSearch
                      mode="multiple"
                      value={this.state.userSearchValue}
                      onChange={(vals) =>
                        this.setState({ userSearchValue: vals })
                      }
                    />
                  ),
                },
              ]}
            />
          </Modal>
        </Col>

        <Col span={24} lg={12}>
          <Card
            title="菜单分配"
            extra={
              <Button
                loading={saveRoleMenusLoading}
                onClick={this.handleSaveRoleMenus}
                type="primary"
              >
                保存
              </Button>
            }
          >
            <Tree
              treeData={treeData}
              checkable
              checkedKeys={checkedKeys}
              onCheck={(keys) => {
                this.setState({ checkedKeys: keys })
              }}
              titleRender={(node: any) => (
                <div title={node.title}>{node.title}</div>
              )}
            />
          </Card>
        </Col>
      </Row>
    )
  }
}

export default Role
