/**
 * 数据字典选择框
 *
 * 例: <DictSelect type='sex' /> 性别选择
 *
 */

import { Select, Radio } from 'antd'
import { useModel } from 'umi'

type IProps = {
  type: string // 字典名称
  showType?: 'radio' | 'select' // 字典展示类型
  disabled?: boolean
}

const DictSelect = (props: IProps) => {
  const { type, showType } = props

  const { initialState } = useModel('@@initialState')
  const { dictData = [] } = initialState

  const dict =
    dictData.find((item) => item.name === type && !item.deleted) || {}
  const options = dict.items || []

  return showType === 'radio' ? (
    <Radio.Group {...props}>
      {options.map((item) => {
        return (
          <Radio value={item.value} key={item.value}>
            {item.label}
          </Radio>
        )
      })}
    </Radio.Group>
  ) : (
    <Select {...props} placeholder="请选择" allowClear options={options} />
  )
}

export default DictSelect
