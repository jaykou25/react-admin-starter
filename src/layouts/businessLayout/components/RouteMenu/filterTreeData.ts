export function filterTreeData(
  treeData,
  searchValue,
  {
    treeNodeFilterProp,
    fieldNames,
  }: {
    fieldNames: any
    treeNodeFilterProp: string
  }
) {
  const { children: fieldChildren } = fieldNames

  if (!searchValue) {
    return treeData
  }

  const upperStr = searchValue.toUpperCase()
  const filterOptionFunc = (_, dataNode) => {
    const value = dataNode[treeNodeFilterProp]

    return String(value).toUpperCase().includes(upperStr)
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
}
