/**
 * 给定一个元素, 获取到该元素下面的文本节点 TextNode
 */
export function getTextNodesFromElement(element) {
  const result: any = []
  const iter = document.createNodeIterator(element, NodeFilter.SHOW_TEXT)
  let textNode

  while ((textNode = iter.nextNode())) {
    result.push(textNode)
  }

  return result
}

export function cursorInTextNode(e) {
  const element = document.elementFromPoint(e.clientX, e.clientY)
  const textNodes = getTextNodesFromElement(element)

  // 遍历所有文本节点，检查鼠标指针是否在文本节点内部
  return textNodes.some((textNode) => {
    /** 通过 range 来获取 textNode 的 rect, 因为 getBoundingClientRect 方法是用在 Element 上的, Node 节点没有这个方法 */
    const range = document.createRange()
    range.selectNode(textNode)
    const rect = range.getBoundingClientRect()
    return positionInRect(rect, e.clientX, e.clientY)
  })
}

/**
 * 判断一个位置在不在 rect 范围内
 */
function positionInRect(rect, x, y) {
  const inX = x >= rect.left && x <= rect.right
  const inY = y >= rect.top && y <= rect.bottom
  return inX && inY
}

export function pathToKey(pathname: string) {
  return pathname.replaceAll('/', '_')
}
