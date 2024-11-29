type PatchItemType = (item: any) => Record<string, any> | undefined

function normalizeItem(item, patchItem?: PatchItemType) {
  const patchResult = patchItem ? patchItem(item) || {} : {}
  const mergeItem = {
    key: item.path,
    label: item.name,
    icon: item.meta?.icon,
    children: item.children,
    ...patchResult,
  }

  if (!mergeItem.children) {
    const { children, ...rest } = mergeItem
    return rest
  }

  return {
    ...mergeItem,
    children: mergeItem.children
      ? mergeItem.children.map((child) => normalizeItem(child, patchItem))
      : [],
  }
}

/**
 * 将后端返回的菜单数据转化成符合 antd menus 的数据格式
 * @param menuData
 * @param patchItem
 * @returns
 */
export function normalizeMenu(menuData = [], patchItem?: PatchItemType) {
  return menuData.map((row) => normalizeItem(row, patchItem))
}

function normalizeItem2(item, patchItem?: PatchItemType) {
  const patchResult = patchItem ? patchItem(item) || {} : {}
  const mergeItem = {
    ...item,
    ...patchResult,
  }

  if (!mergeItem.children) {
    const { children, ...rest } = mergeItem
    return rest
  }

  return {
    ...mergeItem,
    children: mergeItem.children
      ? mergeItem.children.map((child) => normalizeItem(child, patchItem))
      : [],
  }
}

export function normalizeMenu2(menuData = [], patchItem?: PatchItemType) {
  return menuData.map((row) => normalizeItem2(row, patchItem))
}
