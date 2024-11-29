import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

import { queryCode } from '@/apis'
const FormCode = forwardRef((props: any, ref) => {
  const { onChange } = props

  const [codeData, setCodeData] = useState<{
    image: string
    verifyToken: string
  }>({
    image: '',
    verifyToken: '',
  })

  useEffect(() => {
    // 获取code
    handleQueryCode()
  }, [])

  const handleQueryCode = () => {
    queryCode().then((res: any) => {
      setCodeData(res)
      onChange(res.verifyToken)
    })
  }

  useImperativeHandle(
    ref,
    () => ({
      resetCode: handleQueryCode,
    }),
    []
  )

  return (
    <div
      style={{
        cursor: 'pointer',
        marginLeft: '10px',
        marginBottom: '24px',
      }}
    >
      <img onClick={handleQueryCode} src={codeData.image} />
    </div>
  )
})

export default FormCode
