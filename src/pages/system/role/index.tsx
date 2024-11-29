import { Component } from 'react'
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
import styles from './styles.less'
import { getRoleColumns } from './columns'
import { ModalForm, LinkButton, Button } from 'react-admin-kit'
import { hasPermission } from '@/utils'
import { normalizeTree } from '@/utils/treeUtil'

class Role extends Component<any, any> {
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
    }
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
