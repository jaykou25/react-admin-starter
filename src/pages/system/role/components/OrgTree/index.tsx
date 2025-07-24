import { Tag, Tree } from 'antd'
import { useEffect, useState } from 'react'
import { InfoCircleOutlined } from '@ant-design/icons'
import { getOrgTreeList } from '../../apis'

const OrgTree = (props: any) => {
  const { value, onChange } = props
  const [data, setData] = useState<any>([])
  const [expandedKeys, setExpandedKeys] = useState<any>([])

  useEffect(() => {
    getOrgTreeList().then((res: any) => {
      setData(res)
      // 设置展开一级的节点
      setExpandedKeys((res || []).map((item: any) => item.id))
    })
  }, [])

  return (
    <div>
      <div>
        <Tag
          style={{
            padding: '8x',
            fontSize: '14px',
            marginBottom: '10px',
          }}
          color="processing"
          icon={<InfoCircleOutlined />}
        >
          选择组织机构后，该组织机构及其下属组织机构的所有成员都将绑定此角色。
        </Tag>
      </div>
      <Tree
        style={{ height: '300px' }}
        fieldNames={{ key: 'orgid' }}
        treeData={data}
        checkable
        expandedKeys={expandedKeys}
        onExpand={setExpandedKeys}
        selectable={false}
        checkedKeys={value}
        onCheck={(keys) => {
          onChange(keys)
        }}
        checkStrictly
      />
    </div>
  )
}

export default OrgTree
