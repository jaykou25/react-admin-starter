/**
 * @description [ axios 请求封装]
 */

import axios, { AxiosError } from 'axios'
import { history } from 'umi'
import { notification, message as antdMessage } from 'antd'
import { clearToken, getToken } from '@/utils/auth'

let controller
let abortRequest = false

const service = axios.create({
  baseURL: '/', // 由nginx转发
})

// 添加请求拦截器
service.interceptors.request.use(
  function (config: any) {
    const noToken = config.noToken || config.data?.noToken
    if (!noToken) {
      config.headers['Token'] = getToken()
    }

    controller = new AbortController()
    config.signal = controller.signal

    if (abortRequest) {
      controller.abort()
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

      // 防止后面连续的请求报 401
      abortRequest = true

      clearToken()
      history.replace('/login')

      // 返回到 login 页面后恢复请求
      abortRequest = false

      return Promise.reject(error)
    }
  }
)

export default service
