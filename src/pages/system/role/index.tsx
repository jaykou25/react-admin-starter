import { Component, createRef } from 'react'
import { InfoCircleOutlined } from '@ant-design/icons'
import {
  Row,
  Col,
  Space,
  Tag,
  Card,
  Tree,
  Popconfirm,
  Input,
  Tooltip,
} from 'antd'
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
import { getMessage, hasPermission } from '@/utils'
import { normalizeTree } from '@/utils/treeUtil'
import AssignModal from './components/AssignModal'

class Role extends Component<any, any> {
  private innerRef

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

    this.innerRef = createRef()
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
      getMessage().success('删除成功')
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
        getMessage().success('保存成功')
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
      <Row gutter={24} className={styles.roleContainer}>
        <Col span={24} lg={12}>
          <Card
            title={
              <Space>
                <span
                  style={{
                    fontWeight: 500,
                    fontSize: '16px',
                    color: 'rgba(0, 0, 0, 0.88)',
                  }}
                >
                  角色列表
                </span>
                <Tooltip title="给角色分配菜单">
                  <InfoCircleOutlined className={styles.iconHover} />
                </Tooltip>
                <span>
                  <Input
                    placeholder="模糊搜索"
                    onChange={(e) => this.onRoleNameChange(e.target.value)}
                    allowClear
                  />
                </span>
              </Space>
            }
            extra={
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
              </Button>
            }
          >
            <div>
              <div className={styles.listContainer}>
                {showRoleData.map((row: any) => {
                  const isSelected = row.id === selectedRoleId
                  return (
                    <div
                      key={row.id}
                      className={`${styles.listItem} ${isSelected ? styles.selected : ''}`}
                      onClick={() => {
                        const menuIds = row.permissionIds || []
                        this.setState({
                          selectedRoleId: row.id,
                          checkedKeys: menuIds,
                        })
                      }}
                    >
                      <Space>
                        <span className={styles.listItemTitle}>{row.name}</span>
                        {row.status === 0 && <Tag color="blue">禁用</Tag>}
                      </Space>
                      <Space size={8}>
                        <Tooltip title="将组织或人员绑定至该角色">
                          <LinkButton
                            visible={() => hasPermission('roles:edit')}
                            onClick={(e) => {
                              e.stopPropagation()
                              this.innerRef.current.openModal(row.id, row.name)
                            }}
                          >
                            分配
                          </LinkButton>
                        </Tooltip>
                        <LinkButton
                          visible={() => hasPermission('roles:edit')}
                          onClick={(e) => {
                            e.stopPropagation()
                            this.setState({
                              formVisible: true,
                              formData: row,
                              formType: 'edit',
                            })
                          }}
                        >
                          编辑
                        </LinkButton>
                        <Popconfirm
                          title="确认删除该角色吗?"
                          onConfirm={() => this.handleDeleteRole(row.id)}
                        >
                          <LinkButton
                            danger
                            visible={() => hasPermission('roles:del')}
                            onClick={(e) => e.stopPropagation()}
                          >
                            删除
                          </LinkButton>
                        </Popconfirm>
                      </Space>
                    </div>
                  )
                })}
              </div>
            </div>
          </Card>
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

              getMessage().success(
                `${formType === 'new' ? '新增' : '编辑'}成功`
              )
              this.handleQueryRoles()
              return true
            }}
          />
        </Col>

        <Col span={24} lg={12}>
          <Card
            title={
              <Space>
                <span
                  style={{
                    fontWeight: 500,
                    fontSize: '16px',
                    color: 'rgba(0, 0, 0, 0.88)',
                  }}
                >
                  菜单分配
                </span>
              </Space>
            }
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
            <div className={styles.listContainer}>
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
            </div>
          </Card>
        </Col>
        <AssignModal innerRef={this.innerRef} />
      </Row>
    )
  }
}

export default Role
