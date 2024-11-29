import { useState, useRef } from 'react'
import { FormInstance, message, theme } from 'antd'
import { LockTwoTone, ProfileOutlined, UserOutlined } from '@ant-design/icons'
import { history, useModel } from 'umi'
import { Button, SchemaForm } from 'react-admin-kit'

import { isLogin, setToken } from '@/utils/auth'
import Logo from '@/assets/guolian-logo.png'
import { SITE } from '@/utils'

import styles from './index.less'
import LoginMessage from './LoginMessage'
import FormCode from './FormCode'
import { encrypt } from '@/utils/jsencrypt'
import { postLogin } from '@/apis'
import { afterLogin, goto } from '@/utils/login'

const { useToken } = theme

const Login = () => {
  const [status, setStatus] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)

  const { token } = useToken()

  const formRef = useRef<FormInstance>(null)
  const codeRef = useRef<any>(null)

  const { initialState, setInitialState } = useModel('@@initialState')

  const handleSubmit = (values) => {
    const payload = {
      ...values,
      password: encrypt(values.password),
    }
    setSubmitting(true)

    postLogin(payload)
      .then((res: any) => {
        setStatus(0)

        setToken(res)

        afterLogin().then((initValue: any) => {
          setInitialState({
            ...initialState,
            ...initValue,
          })
          message.success('登录成功！')
          if (initValue?.currentUser?.dpwd === 1) {
            // 配置修改密码来源
            sessionStorage.setItem('accountPasswordSource', 'login')
            history.push('/account/password')
          } else {
            goto()
          }
        })
      })
      .catch((e) => {
        codeRef.current?.resetCode()

        // 登录失败清除验证码
        formRef?.current?.setFieldsValue({ code: '' })
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  return (
    <div>
      <section className={styles.top}>
        <div className={styles.header}>
          <div
            className="flex-row align-center"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              if (!isLogin()) {
                message.info('请先登录')
                return
              }

              history.push('/')
            }}
          >
            <img alt="logo" className={styles.logo} src={Logo} />
            <span className={styles.title}>{SITE.name}</span>
          </div>
        </div>
        <div className={styles.desc}>{`欢迎登录${SITE.name}`}</div>
      </section>

      <section className={styles.main}>
        <LoginMessage status={status} submitting={submitting} />
        <SchemaForm
          grid
          isKeyPressSubmit
          colProps={{ span: 24 }}
          formRef={formRef}
          size="large"
          onFinish={handleSubmit}
          columns={[
            {
              dataIndex: 'username',
              fieldProps: {
                prefix: (
                  <UserOutlined
                    style={{
                      color: token.colorPrimary,
                      fontSize: token.fontSize,
                    }}
                  />
                ),
                autoFocus: true,
                placeholder: '用户名',
              },
              formItemProps: {
                rules: [
                  {
                    required: true,
                    message: '请输入用户名!',
                  },
                ],
              },
            },
            {
              dataIndex: 'password',
              valueType: 'password',
              fieldProps: {
                prefix: (
                  <LockTwoTone
                    style={{
                      color: token.colorPrimary,
                      fontSize: token.fontSize,
                    }}
                  />
                ),
                placeholder: '密码',
              },
              formItemProps: {
                rules: [
                  {
                    required: true,
                    message: '请输入密码!',
                  },
                ],
              },
            },
            {
              dataIndex: 'code',
              colProps: { span: 16 },
              fieldProps: {
                prefix: (
                  <ProfileOutlined
                    style={{
                      color: token.colorPrimary,
                      fontSize: token.fontSize,
                    }}
                  />
                ),
                placeholder: '验证码',
              },
              formItemProps: {
                rules: [
                  {
                    required: true,
                    message: '请输入验证码!',
                  },
                ],
              },
            },
            {
              dataIndex: 'verifyCode',
              colProps: { span: 8 },
              renderFormItem: () => <FormCode ref={codeRef} />,
            },
          ]}
        />
        <Button
          loading={submitting}
          size="large"
          block
          type="primary"
          onClick={() => {
            formRef.current?.submit()
          }}
        >
          提交
        </Button>
      </section>
    </div>
  )
}

export default Login
