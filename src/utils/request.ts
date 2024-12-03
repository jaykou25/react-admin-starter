/**
 * @description [ axios 请求封装]
 */

import axios, { AxiosError } from 'axios'
import { history } from 'umi'
import { notification, message as antdMessage } from 'antd'
import { clearToken, getToken } from '@/utils/auth'

const controller = new AbortController()

const service = axios.create({
  baseURL: '/', // 由nginx转发
  signal: controller.signal,
})

// 添加请求拦截器
service.interceptors.request.use(
  function (config: any) {
    const noToken = config.noToken || config.data?.noToken
    if (!noToken) {
      config.headers['Token'] = getToken()
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// Response interceptors
service.interceptors.response.use(
  (response: any) => {
    const { data: outData, config } = response

    const { data, code, message } = outData

    if (code === 5101) {
      antdMessage.info(message)
      return Promise.reject(data)
    } else if (code > 200) {
      // notification.error({ message: '系统错误', description: message })
      // 根据需求改为message提示错误信息
      antdMessage.error(message)
      return Promise.reject(data)
    }

    if (config.responseType === 'blob') {
      return response
    }

    return data
  },
  (error: AxiosError) => {
    const status = error.response?.status

    // 登录过期
    if (status === 401) {
      notification.info({ message: '登录过期' })

      /**
       * 这里用 abort 防止后面连续的请求报 401
       */
      controller.abort()

      clearToken()
      history.replace('/login')

      // controller.abort() 之后需要重新刷新页面, 否则后面的请求进不来
      // 设置延时是因为希望上面 notification.info 能显示一下, 否则页面立即刷新会将通知冲掉.
      setTimeout(() => {
        window.location.reload()
      }, 200)
      return
    }
  }
)

export default service
