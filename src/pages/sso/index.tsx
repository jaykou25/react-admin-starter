import PageLoading from '@/components/page-loading'
import { setToken } from '@/utils/auth'
import { useQuery } from '@/utils'
import { casLogin, userCodeLogin } from '@/apis'
import { useEffect } from 'react'
import { goto, afterLogin } from '@/utils/login'
import { useModel } from 'umi'
import { ss } from '@/utils'

const Sso = () => {
  const { ticket, redirect, userCode } = useQuery()
  const { initialState, setInitialState } = useModel('@@initialState')

  const ssoLogin = async () => {
    // 每次都走sso登录

    // 如果有跳转的url, 将它存到sessionStorage里
    if (redirect) ss.set('redirect', decodeURIComponent(redirect))

    if (!ticket && !userCode) {
      // window.location.href = ssoSite()
      return
    }

    if (userCode) {
      const token = await userCodeLogin({ empId: userCode })
      setToken(token)
    } else {
      const token = await casLogin({ ticket: encodeURIComponent(ticket) })
      setToken(token)
    }

    afterLogin().then((initValue: any) => {
      setInitialState({
        ...initialState,
        ...initValue,
      })
      goto()
    })
  }

  useEffect(() => {
    ssoLogin()
  }, [ticket, redirect])

  return <PageLoading />
}

export default Sso
