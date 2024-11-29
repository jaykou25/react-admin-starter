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
    treeNodeFilterProp: string
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
        const value = dataNode[treeNodeFilterProp]

        return String(value).toUpperCase().includes(upperStr)
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
