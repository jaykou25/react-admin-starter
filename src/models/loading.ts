import { useState } from 'react'

/**
 * 用于页面加载
 */
export default () => {
  const [loading, setLoading] = useState(false)

  return { loading, setLoading }
}
