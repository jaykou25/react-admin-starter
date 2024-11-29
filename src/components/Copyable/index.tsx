import { useState } from 'react'
import { CheckOutlined, CopyOutlined } from '@ant-design/icons'
import copy from 'copy-to-clipboard'

type CopyableType = {
  value?: string
}

function Copyable(props: CopyableType) {
  const { value = '' } = props
  const [copied, setCopied] = useState(false)

  return (
    <span
      style={{ color: '#1890ff', cursor: copied ? undefined : 'pointer' }}
      onClick={() => {
        if (!copied) {
          copy(value)
          setCopied(true)
          setTimeout(() => setCopied(false), 3000)
        }
      }}
    >
      {copied ? <CheckOutlined /> : <CopyOutlined />}
    </span>
  )
}

export default Copyable
