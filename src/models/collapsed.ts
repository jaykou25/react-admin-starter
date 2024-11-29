import { useState } from 'react'

/**
 * 用于判断菜单是否折叠
 */
export default () => {
  const [collapsed, setCollapsed] = useState(false)

  return { collapsed, setCollapsed }
}
