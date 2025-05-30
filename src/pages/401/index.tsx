import { Button, Result } from 'antd'
import { history } from 'umi'

const NoAuthPage: React.FC = () => (
  <Result
    status="403"
    title="401"
    subTitle="您没有权限访问该页面."
    extra={
      <Button type="primary" onClick={() => history.back()}>
        返回
      </Button>
    }
  />
)

export default NoAuthPage
