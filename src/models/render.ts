import { useState } from 'react'

/**
 * 用于重渲染页面
 */
export default () => {
  const [renderKey, setRenderKey] = useState(1)

  const render = () => {
    setRenderKey((val) => val + 1)
  }

  return { renderKey, render }
}
