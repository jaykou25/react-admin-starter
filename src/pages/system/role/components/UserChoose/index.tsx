import type { UserChooseProps } from 'react-gov-ui'
import { UserChooseBase } from 'react-gov-ui'

import { getOrgTreeList, getOrgUsers } from '../../apis'

const UserChoose = (props: UserChooseProps) => {
  return (
    <UserChooseBase
      selectOptionLabelRender={(item) =>
        `${item.nickname} (${item.userInfo.orgName})`
      }
      userDescLeftRender={(item) => item.userInfo?.empNo}
      userDescRightRender={(item) => item.userInfo?.orgName}
      getUsersApi={({ keyword, current, pageSize }) =>
        getOrgUsers({
          keyword,
          current,
          pageSize,
        })
      }
      getOrgTreeApi={getOrgTreeList}
      getOrgUsersApi={({ node, current, pageSize }) => {
        return getOrgUsers({
          orgId: node.orgid,
          current: current,
          pageSize,
        })
      }}
      {...props}
    />
  )
}

export default UserChoose
