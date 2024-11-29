import { normalizeTree, filterTree, getTreeChain, visitTree } from './treeUtil'
import { createElement } from 'react'

/**
 * 测试 normalizeTree
 */
test('normalizeTree 默认是会合并数据的', () => {
  const data = [{ key: 1 }]
  result = normalizeTree(data, () => ({
    id: 1,
  }))
  expect(result).toEqual([{ key: 1, id: 1 }])
})

test('normalizeTree 默认是会合并数据的 二层', () => {
  const data = [{ key: 1, children: [{ key: 2 }] }]
  result = normalizeTree(data, (node) => ({
    id: node.key,
  }))
  expect(result).toEqual([{ key: 1, id: 1, children: [{ key: 2, id: 2 }] }])
})

test('normalizeTree 覆盖数据', () => {
  const data = [{ key: 1 }]
  result = normalizeTree(
    data,
    () => ({
      id: 1,
    }),
    { replace: true }
  )
  expect(result).toEqual([{ id: 1 }])
})

test('normalizeTree 覆盖数据的 二层', () => {
  const data = [{ key: 1, children: [{ key: 2 }] }]
  result = normalizeTree(
    data,
    (node) => ({
      id: node.key,
      children: node.children,
    }),
    { replace: true }
  )
  expect(result).toEqual([{ id: 1, children: [{ id: 2 }] }])
})

test('normalizeTree 不会修改原数据', () => {
  const data = [{ key: 1 }]
  result = normalizeTree(data, () => ({
    id: 1,
  }))
  result[0].key = 2
  expect(data[0].key).toBe(1)
})

test('normalizeTree 不会修改原数据 二层', () => {
  const data = [{ key: 1, children: [{ key: 2 }] }]
  result = normalizeTree(data, () => ({
    id: 1,
  }))
  result[0].children[0].key = 20
  expect(data[0].children[0].key).toBe(2)
})

test('filterTree 返回所有', () => {
  const data = [{ key: 1 }]
  result = filterTree(data, () => true)
  expect(result).toEqual([{ key: 1 }])
})

test('filterTree 返回过滤的', () => {
  const data = [{ key: 1 }, { key: 2 }]
  result = filterTree(data, (item) => item.key === 1)
  expect(result).toEqual([{ key: 1 }])
})

test('filterTree 返回所有的 - children', () => {
  const data = [{ key: 1, children: [{ key: '1-1' }] }, { key: 2 }]
  result = filterTree(data, () => true)
  expect(result).toEqual([{ key: 1, children: [{ key: '1-1' }] }, { key: 2 }])
})

test('filterTree 返回深度为一级的项', () => {
  const data = [{ key: 1, children: [{ key: '1-1' }] }, { key: 2 }]
  result = filterTree(data, (item) => item.depth === 0)
  expect(result).toEqual([{ key: 1, children: [] }, { key: 2 }])
})

test('filterTree 没有改变原数据', () => {
  const data = [{ key: 1, children: [{ key: '1-1' }] }, { key: 2 }]
  result = filterTree(data, () => true)
  result[0].key = 2
  expect(data[0].key).toBe(1)
})

test('filterTree 没有改变原数据 二层', () => {
  const data = [{ key: 1, children: [{ key: '1-1' }] }, { key: 2 }]
  result = filterTree(data, () => true)
  result[0].children[0].key = 2
  expect(data[0].children[0].key).toBe('1-1')
})

/**
 * 测试 getTreeChain 方法
 */
test('findTree 找到第一层', () => {
  const data = [{ id: 1 }, { id: 2 }]
  result = getTreeChain(data, (node) => node.id === 1)
  expect(result).toEqual([{ id: 1 }])
})

test('findTree 找到第一层中的第二个', () => {
  const data = [{ id: 1 }, { id: 2 }]
  result = getTreeChain(data, (node) => node.id === 2)
  expect(result).toEqual([{ id: 2 }])
})

test('findTree 找到第二层', () => {
  const data = [{ id: 1, children: [{ id: 3 }] }, { id: 2 }]
  result = getTreeChain(data, (node) => node.id === 3)
  expect(result).toEqual([{ id: 1, children: [{ id: 3 }] }, { id: 3 }])
})

test('findTree 找到第二层中的第二个', () => {
  const data = [{ id: 1 }, { id: 2, children: [{ id: 3 }, { id: 4 }] }]
  result = getTreeChain(data, (node) => node.id === 4)
  expect(result).toEqual([
    { id: 2, children: [{ id: 3 }, { id: 4 }] },
    { id: 4 },
  ])
})

test('findTree benchmark', () => {
  const data = [
    { id: 1, ele: window.ReportBody, jsx: createElement('div') },
    { id: 2, children: [{ id: 3 }, { id: 4 }] },
  ]
  const start = Date.now()
  result = getTreeChain(data, (node) => node.id === 4)
  const end = Date.now()
  const time = end - start
  expect(time).toBeLessThan(2)
})

test('findTree 找不到', () => {
  const data = [{ id: 1, children: [{ id: 3 }] }, { id: 2 }]
  result = getTreeChain(data, (node) => node.id === 4)
  expect(result).toEqual([])
})

test('getTreeChain 不改变原来的数据', () => {
  const data = [{ id: 1, children: [{ id: 3 }] }, { id: 2 }]
  result = getTreeChain(data, (node) => node.id === 1)
  result[0].id = 2
  expect(data[0].id).toBe(1)
})

test('getTreeChain 不改变原来的数据 二层', () => {
  const data = [{ id: 1, children: [{ id: 3 }] }, { id: 2 }]
  result = getTreeChain(data, (node) => node.id === 1)
  result[0].children[0].id = 2
  expect(data[0].children[0].id).toBe(3)
})

/**
 * 测试 visitTree
 */
test('visitTree 按顺序执行', () => {
  const data = {
    text: 'd',
    children: [{ text: 'b', children: [{ text: 'a' }] }, { text: 'c' }],
  }

  const arr = []
  visitTree(data, (item) => {
    arr.push(item.text)
  })

  expect(arr.join(',')).toBe('a,b,c,d')
})
