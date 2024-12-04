import { createFromIconfontCN } from '@ant-design/icons'
import { IconFontProps } from '@ant-design/icons/lib/components/IconFont'
import { useModel } from 'umi'

const IconFont = (props: IconFontProps) => {
  const { initialState } = useModel('@@initialState')

  const Icon = createFromIconfontCN({
    scriptUrl: [initialState.iconfontUrl],
  })

  return <Icon {...props} />
}

export default IconFont
