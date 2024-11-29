import { useEffect, useRef, useState } from 'react'

import { ProTable, clearTreeSelectCache } from 'react-admin-kit'
import {
  addMenus,
  delMenus,
  editMenu,
  queryMenuInfo,
  queryMenusNoButton,
} from '@/apis/system'
import { Button, message, Input, Drawer } from 'antd'
import { getColumns } from './columns'
import { getFormColumns } from './formColumns'
import { FORM_TYPE_MAP } from '@/utils'
import { getButtonColumns } from './buttonColumns'
import useFilterTreeData from './useFilterTreeData'
import { normalizeTree } from '@/utils/treeUtil'
import { PlusOutlined } from '@ant-design/icons'

const SystemMenu = () => {
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState<any>([])

  const [open, setOpen] = useState(false)
  const [selectedMenu, setSelectedMenu] = useState<any>({})

  const [rowKeys, setRowKeys] = useState<string[]>([])

  const [keyword, setKeyword] = useState<string>('')
  const filteredTreeData = useFilterTreeData(dataSource, keyword, {
    fieldNames: { children: 'children' },
    treeNodeFilterProp: 'name',
  })
  useEffect(() => {
    if (keyword) {
      setRowKeys(filteredTreeData.map((item) => item.id))
    } else {
      setRowKeys([])
    }
  }, [keyword])

  const buttonInnerRef = useRef<any>()
  const buttonActionRef = useRef<any>()

  const innerRef = useRef<any>()

  const handleQueryMenus = () => {
    // 请求菜单列表
    setLoading(true)
    queryMenusNoButton()
      .then((res) => {
        setDataSource(
          /**
           * 将树形数据中 children: [] 的数据改成 children: null
           */
          normalizeTree(res, (item) => {
            if (item.children && item.children.length === 0) {
              return { children: null }
            }
            return {}
          })
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    handleQueryMenus()
  }, [])

  const handleFinish = async (values, formType, formData) => {
    if (formType === 'new') {
      await addMenus({ ...values, type: 1, code: values.routeUrl })
    }
    if (formType === 'edit') {
      await editMenu({ ...values, id: formData.id, type: formData.type })
    }
    message.success(`${FORM_TYPE_MAP[formType]}成功`)

    handleQueryMenus()

    clearTreeSelectCache('menu')

    return true
  }

  const handleButtonFinish = async (values, formType, formData) => {
    if (formType === 'new') {
      await addMenus({
        ...values,
        type: 2,
        parentId: selectedMenu.id,
      })
    }
    if (formType === 'edit') {
      await editMenu({ ...values, id: formData.id, parentId: selectedMenu.id })
    }
    message.success(`${FORM_TYPE_MAP[formType]}成功!`)

    if (buttonActionRef.current) {
      buttonActionRef.current.reload()
    }

    return true
  }

  /**
   * 这是一个临时方法, 用于修复后端的问题.
   * 当菜单移动后, 被移动的菜单上维护的父菜单信息会有问题.
   * 用这个方法来临时修复.
   */
  const patchAll = () => {
    normalizeTree(dataSource, (item) => {
      // 批量更新
      const { children, createTime, updateTime, ...rest } = item
      editMenu({ ...rest })

      return {}
    })
  }

  return (
    <div>
      <ProTable
        size="small"
        bordered
        innerRef={innerRef}
        search={false}
        loading={loading}
        name="菜单"
        headerTitle={false}
        columns={getColumns({ setOpen, setSelectedMenu })}
        dataSource={filteredTreeData}
        expandable={{
          expandRowByClick: true,
          expandedRowKeys: rowKeys,
          onExpandedRowsChange: (keys: any) => setRowKeys(keys),
        }}
        pagination={false}
        delFunction={(ids) =>
          new Promise((resolve) => {
            delMenus(ids[0]).then(() => {
              handleQueryMenus()
            })
          })
        }
        toolbar={{
          search: (
            <Input
              placeholder="搜索菜单"
              value={keyword}
              allowClear
              onChange={(e) => setKeyword(e.currentTarget.value)}
            />
          ),
          title: [
            <Button
              key={1}
              type="primary"
              onClick={() => innerRef.current?.openModal('new')}
              icon={<PlusOutlined />}
            >
              新增
            </Button>,
            <Button style={{ display: 'none' }} key={2} onClick={patchAll}>
              更新所有菜单和按钮
            </Button>,
          ],
        }}
        formColumns={getFormColumns()}
        onFinish={handleFinish}
      />

      {/* 按钮资源 */}
      <Drawer
        width={'50%'}
        open={open}
        onClose={() => setOpen(false)}
        destroyOnClose
      >
        <ProTable
          name="按钮资源"
          search={false}
          modalProps={{ confirmOnClose: false }}
          innerRef={buttonInnerRef}
          actionRef={buttonActionRef}
          columns={getButtonColumns({ selectedMenu })}
          request={() =>
            queryMenuInfo(selectedMenu.id).then((res) => {
              const list = normalizeTree(res.children, (item) => {
                if (item.children && item.children.length === 0) {
                  return { children: null }
                }
                return {}
              })
              return { data: list.filter((item) => item.type == 2) }
            })
          }
          pagination={false}
          toolbar={{
            actions: [
              <Button
                key={1}
                onClick={() => {
                  buttonInnerRef.current?.openModal('new', {
                    fatherMenuName: selectedMenu.name,
                    sort: (buttonInnerRef.current?.dataSource.length + 1) * 10,
                  })
                }}
                type="primary"
              >
                新增按钮
              </Button>,
            ],
          }}
          onFinish={handleButtonFinish}
          delFunction={delMenus}
        />
      </Drawer>
    </div>
  )
}

export default SystemMenu
