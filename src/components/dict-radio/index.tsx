/**
 * 数据字典单选框
 *
 * 例: <DictRadio type='sex' /> 性别选择
 *
 */

import { Radio } from 'antd'
import { useModel } from 'umi'
import type { RadioGroupProps } from 'antd'

type IProps = {
  type: string // 字典名称
}

const DictSelect = (props: RadioGroupProps & IProps) => {
  const { type, ...rest } = props

  const { initialState } = useModel('@@initialState')
  const { dictData = [] } = initialState

  const dict =
    dictData.find((item) => item.name === type && !item.deleted) || {}
  const options = dict.items || []

  return (
    <Radio.Group {...rest}>
      {options.map((item) => {
        return (
          <Radio value={item.value} key={item.value}>
            {item.label}
          </Radio>
        )
      })}
    </Radio.Group>
  )
}

export default DictSelect
