import { NotificationInstance } from 'antd/es/notification/interface'

let notificationApi: NotificationInstance | null = null

export const setGlobalNotificationApi = (api) => {
  notificationApi = api
}

export const getNotification = (): NotificationInstance => notificationApi!
