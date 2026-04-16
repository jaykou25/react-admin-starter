import { MessageInstance } from 'antd/es/message/interface'

let messageApi: MessageInstance | null = null

export const setGlobalMessageApi = (api) => {
  messageApi = api
}

export const getMessage = (): MessageInstance => messageApi!
