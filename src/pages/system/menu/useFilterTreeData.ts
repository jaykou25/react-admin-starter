import React from 'react'

export default (
  treeData,
  searchValue: string,
  {
    treeNodeFilterProp,
    filterTreeNode,
    fieldNames,
  }: {
    fieldNames: any
    treeNodeFilterProp: string[] // 修改为字符串数组
    filterTreeNode?: any
  }
) => {
  const { children: fieldChildren } = fieldNames

  return React.useMemo(() => {
    if (!searchValue || filterTreeNode === false) {
      return treeData
    }

    let filterOptionFunc
    if (typeof filterTreeNode === 'function') {
      filterOptionFunc = filterTreeNode
    } else {
      const upperStr = searchValue.toUpperCase()
      filterOptionFunc = (_, dataNode) => {
        // 遍历 treeNodeFilterProp 数组，检查任意字段是否匹配
        return treeNodeFilterProp.some((prop) => {
          const value = dataNode[prop]
          return String(value).toUpperCase().includes(upperStr)
        })
      }
    }

    function dig(list, keepAll: boolean = false) {
      return list
        .map((dataNode) => {
          const children = dataNode[fieldChildren]

          const match = keepAll || filterOptionFunc(searchValue, dataNode)
          const childList = dig(children || [], match)

          if (childList.length) {
            return {
              ...dataNode,
              isLeaf: undefined,
              [fieldChildren]: childList,
            }
          }

          if (match) {
            return {
              ...dataNode,
              isLeaf: true,
            }
          }
          return null
        })
        .filter((node) => node)
    }

    return dig(treeData)
  }, [treeData, searchValue, fieldChildren, treeNodeFilterProp, filterTreeNode])
}
