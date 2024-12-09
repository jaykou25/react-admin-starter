import { message } from 'antd'
import { useRef, useState } from 'react'

const useSelectedRows = () => {
  const [selectedRowKeys, setKeys] = useState([])

  const rowsRef = useRef<any>([])
  const filterSelectedRows = (fn: (row: any) => boolean, rowKey?: string) => {
    const result: any[] = []
    selectedRowKeys.forEach((key) => {
      const row = rowsRef.current.find((item) => item[rowKey || 'id'] === key)
      if (row && fn(row)) {
        result.push(row)
      }
    })

    return result
  }

  const onSelectedRowChange = (keys, rows) => {
    setKeys(keys)
    rowsRef.current = rows
  }

  type DeleteUtilOptions = {
    delay?: number
    msg?: string
    actionRef: any
  }
  /**
   * 包装删除操作
   */
  const deleteUtil = (deletePromise, options: DeleteUtilOptions) => {
    const { delay = 1, msg = '删除成功', actionRef } = options

    Promise.all([deletePromise]).then(() => {
      message.success(msg, delay, () => {})
      onSelectedRowChange([], [])

      const action = actionRef.current
      if (action) {
        const { current, total, pageSize } = action.pageInfo
        console.log('action', action)
        // 判断当前是否为空
        const deleteRecordLength = (selectedRowKeys || []).length
        const isCurrentEmpty =
          total - deleteRecordLength === (current - 1) * pageSize
        if (current > 1 && isCurrentEmpty) {
          action.setPageInfo({ current: current - 1 })
          return
        }
      }

      actionRef.current?.reload()
    })
  }

  return {
    filterSelectedRows,
    onSelectedRowChange,
    selectedRowKeys,
    deleteUtil,
  }
}

export default useSelectedRows
