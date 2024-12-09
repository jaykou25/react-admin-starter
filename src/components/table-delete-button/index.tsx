import { ExclamationCircleFilled } from '@ant-design/icons'
import { Modal } from 'antd'
import { useState } from 'react'
import { Button } from 'react-admin-kit'

type IProps = {
  disabled: boolean
  onOk: any
  num: number
  onClick?: any
}

const TableDeleteButton = (props: IProps) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  return (
    <>
      <Button
        danger
        type="primary"
        disabled={props.disabled}
        onClick={() => {
          setOpen(true)
          if (props.onClick) {
            props.onClick()
          }
        }}
      >
        删除
      </Button>
      <Modal
        okButtonProps={{ loading }}
        cancelButtonProps={{ disabled: loading }}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={async () => {
          setLoading(true)

          await props.onOk()

          setLoading(false)
          setOpen(false)
        }}
        width={416}
        closable={false}
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ExclamationCircleFilled
              style={{
                color: '#faad14',
                fontSize: '22px',
                marginRight: '12px',
              }}
            />{' '}
            <span>{`确定删除 ${props.num} 条数据吗?`}</span>
          </div>
        }
      >
        <div style={{ height: '10px' }}></div>
      </Modal>
    </>
  )
}

export default TableDeleteButton
