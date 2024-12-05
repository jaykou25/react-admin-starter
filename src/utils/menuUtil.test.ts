import { getBreadItems, getMenukeys, normalizeForAntdMenu } from './menuUtil'

test('转换菜单数据', () => {
  const data = [
    {
      id: 1,
      type: 1,
      isShow: true,
      name: '系统管理',
      routeUrl: 'org',
      children: [
        {
          id: 2,
          type: 1,
          isShow: true,
          name: '人员管理',
          routeUrl: 'user',
          children: [],
        },
        {
          id: 3,
          type: 1,
          isShow: false,
          name: '设置管理',
          routeUrl: 'setting',
          children: [],
        },
      ],
    },
  ]

  const after = normalizeForAntdMenu(data)

  expect(after).toEqual([
    {
      label: '系统管理',
      title: '系统管理',
      key: 'org',
      icon: null,
      children: [
        {
          label: '人员管理',
          title: '人员管理',
          key: 'user',
          icon: null,
        },
      ],
    },
  ])
})

test('取菜单树中的 key', () => {
  const data = [
    {
      id: 1,
      children: [
        {
          id: 2,
        },
        {
          id: null,
        },
        {
          id: 2,
        },
      ],
    },
  ]

  const keys = getMenukeys(data, (item) => item.id)
  expect(keys).toEqual([1, 2])
})

describe('转换成面包屑数据', () => {
  const data = [
    {
      id: 1,
      type: 1,
      isShow: true,
      name: '系统管理',
      routeUrl: 'org',
      children: [
        {
          id: 2,
          type: 1,
          isShow: true,
          name: '人员管理',
          routeUrl: 'user',
          children: [
            {
              routeUrl: '/user/new',
              name: '人员新建',
              type: 1,
              isShow: false,
            },
          ],
        },
        {
          id: 3,
          type: 1,
          isShow: true,
          name: '设置管理',
          routeUrl: 'setting',
          children: [
            {
              routeUrl: '/setting/new',
              name: '设置新建',
              type: 1,
              isShow: false,
            },
          ],
        },
      ],
    },
  ]

  const dataSingle = [
    {
      id: 1,
      type: 1,
      isShow: true,
      name: '系统管理',
      routeUrl: 'org',
      children: [
        {
          id: 2,
          type: 1,
          isShow: true,
          name: '人员管理',
          routeUrl: 'user',
          children: [
            {
              routeUrl: '/user/new',
              name: '人员新建',
              type: 1,
              isShow: false,
            },
          ],
        },
      ],
    },
  ]

  test('正常转换', () => {
    const after = getBreadItems(data, '/user/new')

    // 面包屑数量应该有 4 个
    expect(after.length).toBe(4)
    // 最后一个节点是只读文本
    expect(after[3].title).toBe('人员新建')

    // 用户管理页是可点击的
    expect(typeof after[2].title).not.toBe('string')

    // 系统管理节点是有下拉的
    expect(after[1].title).toBe('系统管理')
    expect(after[1].menu.items.length > 0).toBe(true)

    // 下拉中只有设置管理, 没有人员管理, 因为人员管理在当前面包屑上的.
    expect(after[1].menu.items.length).toBe(1)
    expect(after[1].menu.items[0].key).toBe('setting')
    // 下拉中的设置管理是可点击的
    expect(typeof after[1].menu.items[0].label).not.toBe('string')
  })

  test('可以控制面包屑最后一个节点的显示名字', () => {
    const after = getBreadItems(data, '/user/new', { leafBreadName: '新' })

    expect(after[3].title).toBe('新')
  })

  test('单行数据', () => {
    const after = getBreadItems(dataSingle, '/user/new')

    // 系统管理没下拉
    expect(after[1].menu).toBeUndefined()

    // 系统管理不可点
    expect(typeof after[1].title).toBe('string')

    // 人员管理可点
    expect(typeof after[2].title).not.toBe('string')
  })
})
