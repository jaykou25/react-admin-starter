import { cloneDeepWith, isElement } from 'lodash-es'
import { isValidElement } from 'react'

export function cloneTree(value) {
  return cloneDeepWith(value, (val) => {
    if (isElement(val) || isValidElement(val)) {
      return true
    }
  })
}

function normalizeTreeItem(item, patchItem?: PatchItemType, options?: any) {
  const { replace } = options || {}
  const patchResult = patchItem ? patchItem(item) || {} : {}

  const mergeItem = replace ? { ...patchResult } : { ...item, ...patchResult }

  if (!mergeItem.children) {
    const { children, ...rest } = mergeItem
    return rest
  }

  return {
    ...mergeItem,
    children: mergeItem.children
      ? mergeItem.children.map((child) =>
          normalizeTreeItem(child, patchItem, options)
        )
      : [],
  }
}

type PatchItemType = (item: any) => Record<string, any> | undefined

/**
 * 利用一个 patchItem 方法来处理 tree item
 * @param menuData
 * @param patchItem
 * @param options patch 结果是否覆盖
 * @returns
 */
export function normalizeTree(
  menuData: any[] = [],
  patchItem?: PatchItemType,
  options?: { replace: boolean }
): any[] {
  const { replace = false } = options || {}
  return menuData.map((row) => normalizeTreeItem(row, patchItem, { replace }))
}

type FilterType = (item: any) => boolean

/**
 * 通过传入一个函数来过滤树, 不符合条件的tree item 会被过滤掉
 * @param data
 * @param filter
 * @returns
 */
export function filterTree(_data: any = [], filter: FilterType, depth = 0) {
  const data = depth === 0 ? cloneTree(_data) : _data

  const result: any = []
  data.forEach((item) => {
    const verified = filter({ ...item, depth })

    if (!verified) return

    if (verified && item.children) {
      item.children = filterTree(item.children, filter, depth + 1)
    }

    return result.push(item)
  })

  return result
}

/**
 * 寻找树中的目标节点.
 * 如果找不到返回 []
 * 如果找到返回从头到目标节点的数组链
 * @param {Array} data
 * @param {string | number} value
 * @param {string} keyName
 * @returns
 */
export function getTreeChain(
  _data = [],
  findFunction: (node: any) => boolean,
  chain = [],
  depth = 0
) {
  let result

  const data = depth === 0 ? cloneTree(_data) : _data

  for (let i = 0; i < data.length; i++) {
    const node = data[i]

    const target = findTreeItem(node, findFunction, chain, depth)

    if (target) {
      result = target
      break
    } else {
      chain.splice(depth)
    }
  }

  return depth > 0 ? result : chain
}

function findTreeItem(node, findFunction, chain, depth) {
  chain.push(node)
  if (findFunction(node)) {
    return node
  }

  if (node.children && node.children.length) {
    return getTreeChain(node.children, findFunction, chain, depth + 1)
  }
  return undefined
}

export function visitTree(tree, fn, options?: { childrenName?: string }) {
  const { childrenName = 'children' } = options || {}

  if (tree[childrenName] && Array.isArray(tree[childrenName])) {
    tree[childrenName].forEach((item) => {
      visitTree(item, fn, options)
    })
  }

  if (fn) {
    fn(tree)
  }
}

/**
 * 遍历tree, 找到目标节点, 找不到返回undefined
 */
export function findTree(
  data = [],
  fn: (item: any) => boolean,
  options?: { childrenName: string }
) {
  let result

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < data.length; i++) {
    const target = findTreeItemLoop(data[i], fn, options)

    if (target) {
      result = target
      break
    }
  }

  return result
}

function findTreeItemLoop(data, fn, options) {
  const { childrenName = 'children' } = options || {}
  if (fn(data)) {
    return data
  }
  if (data[childrenName] && data[childrenName].length) {
    return findTree(data[childrenName], fn, options)
  }
  return undefined
}
