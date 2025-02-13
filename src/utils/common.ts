import { useLocation, history, createSearchParams } from 'umi'
import qs from 'qs'
import { message } from 'antd'

export const useQuery = () => {
  const { search } = useLocation()

  const query = qs.parse(search.split('?')[1] || '')

  return query
}

export const getWindowQuery = (field) => {
  return window.top?.location.search[field] || ''
}

export const isUrl = (path: string | undefined): boolean => {
  if (!path) return false
  if (!path.startsWith('http')) {
    return false
  }
  try {
    const url = new URL(path)
    return !!url
  } catch (error) {
    return false
  }
}

/** 判断是否是图片链接 */
export function isImg(path: string): boolean {
  return /\w.(png|jpg|jpeg|svg|webp|gif|bmp)$/i.test(path)
}

// 判断是否有权限
export const hasPermission = (code?: string) => {
  if (!code) return true

  if (window['_isAdmin']) return true

  return window['_codes'].includes(code)
}

/**
 * 文件下载
 */
export const downloadFile = ({ data, headers }, fileName?: string) => {
  if (!data) {
    message.error('数据异常')
    return
  }
  const name = fileName || headers['content-disposition'].split('filename=')[1]
  // 支持IE浏览器
  if (window?.navigator?.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(data, name)
    return
  }
  const url = window.URL.createObjectURL(data)
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', name)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

type SubmitUtilOptions = {
  delay?: number
  msg?: string
}
/**
 * 包装提交操作
 * 把设置 loading, 操作成功后的提醒, 回退等操作包装起来
 */
export const submitUtil = (submitPromise, options: SubmitUtilOptions = {}) => {
  const { delay = 1, msg = '提交成功' } = options

  document.dispatchEvent(new Event('loading'))
  Promise.all([submitPromise])
    .then(() => {
      message.success(msg, delay, () => {
        document.dispatchEvent(new Event('unloading'))
        document.dispatchEvent(new Event('reload'))
        history.back()
      })
    })
    .catch(() => {
      document.dispatchEvent(new Event('unloading'))
    })
}

export const fetchUtil = (fetchPromise: Promise<any>) => {
  document.dispatchEvent(new Event('loading'))
  Promise.all([fetchPromise])
    .then(() => {
      document.dispatchEvent(new Event('unloading'))
    })
    .catch(() => {
      document.dispatchEvent(new Event('unloading'))
    })
}

export function padStart(num, len, flag) {
  const value = parseInt(num)
  if (value < 10) {
    return flag + num
  }
  return num
}

// 针对history路由, hash放在最后
export const fullPath = () => {
  const { pathname, search, hash } = window.location
  return pathname + search + hash
}

// 跳转到以当前页面为根路由的一个相对路径
export const toRelative = (path: string, query?: any) => {
  const { pathname } = window.location

  // 去掉 pathname 末尾的斜杠 /
  const _pathname = pathname.replace(/\/$/, '')

  // 去掉 path 前面的斜杠 /
  const _path = path.replace(/^\//, '')

  const finalPath = [_pathname, _path].join('/')

  history.push({
    pathname: finalPath,
    search: createSearchParams(query || {}).toString(),
  })
}
