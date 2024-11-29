import { Alert } from 'antd'

const MessageMap = {
  1: '账户或密码错误',
  2: '验证码错误',
  3: '验证码过期',
}

const LoginMessage = (props: { status?: 1 | 2 | 3; submitting: boolean }) => {
  const { status, submitting } = props

  if (submitting || !status) return ''

  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={MessageMap[status]}
      type="error"
      showIcon
    />
  )
}

export default LoginMessage
