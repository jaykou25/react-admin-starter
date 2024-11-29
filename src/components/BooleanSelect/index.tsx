import { Select } from 'antd'
import type { SelectProps } from 'antd'

// 扩展antd Radio的参数
interface IProps extends SelectProps<T> {
  yesText?: string
  noText?: string
  yesValue?: string | number | boolean
  noValue?: string | number | boolean
}

function BooleanSelect(props: IProps) {
  const {
    yesText = '是',
    noText = '否',
    yesValue = 1,
    noValue = 0,
    ...rest
  } = props
  return (
    <Select allowClear placeholder="请选择" {...rest}>
      <Select.Option value={yesValue}>{yesText}</Select.Option>
      <Select.Option value={noValue}>{noText}</Select.Option>
    </Select>
  )
}

export default BooleanSelect
