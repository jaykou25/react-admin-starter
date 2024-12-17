/**
 * 数据字典选择框
 *
 * 例: <DictSelect type='sex' /> 性别选择
 *
 */

import { Select } from 'antd'
import { useModel } from 'umi'
import type { SelectProps } from 'antd'

type IProps = {
  type: string // 字典名称
  readonly?: boolean
}

const DictSelect = (props: SelectProps & IProps) => {
  const { type, readonly, ...rest } = props

  const { initialState } = useModel('@@initialState')
  const { dictData = [] } = initialState

  const dict =
    dictData.find((item) => item.name === type && !item.deleted) || {}
  const options = dict.items || []

  if (readonly) {
    if (props.mode === 'multiple') {
      const targets: string[] = []

      if (props.value) {
        props.value.forEach((val) => {
          const target = options.find((item) => item.value === val)
          if (target) targets.push(target.label)
        })
      }

      return targets.join(', ')
    }
    const target = options.find((item) => item.value === props.value)
    return target && target.label
  }

  return <Select placeholder="请选择" allowClear options={options} {...rest} />
}

export default DictSelect
