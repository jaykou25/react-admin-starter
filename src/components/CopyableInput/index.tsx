import { Input } from 'antd'
import type { InputProps } from 'antd'
import Copyable from '../Copyable'

type CopyableInputType = {
  value?: string
  onChange?: any
} & InputProps

function CopyableInput(props: CopyableInputType) {
  const { value, onChange, ...rest } = props

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Input
        style={{ marginRight: '3px' }}
        value={value}
        onChange={onChange}
        {...rest}
      />
      <Copyable value={value} />
    </div>
  )
}

export default CopyableInput
