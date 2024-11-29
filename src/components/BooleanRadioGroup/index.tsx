import { Radio } from 'antd'
import type { RadioProps } from 'antd'

// 扩展antd Radio的参数
interface IProps extends RadioProps {
  yesText?: string
  noText?: string
  yesValue?: boolean | string | number
  noValue?: boolean | string | number
}

function BooleanRadioGroup(props: IProps) {
  const { yesText, noText, yesValue, noValue, ...rest } = props
  return (
    <Radio.Group {...rest}>
      <Radio value={yesValue}>{yesText}</Radio>
      <Radio value={noValue}>{noText}</Radio>
    </Radio.Group>
  )
}

export default BooleanRadioGroup

BooleanRadioGroup.defaultProps = {
  yesText: '是',
  noText: '否',
  yesValue: 1,
  noValue: 0,
}
