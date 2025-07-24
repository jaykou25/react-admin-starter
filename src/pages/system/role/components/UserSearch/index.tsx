import type { UserChooseProps } from 'react-gov-ui'
import { UserSearchBase } from 'react-gov-ui'

import { getOrgUsers } from '../../apis'

const UserSearch = (props: UserChooseProps) => {
  return (
    <UserSearchBase
      selectOptionLabelRender={(item) =>
        `${item.nickname} (${item.userInfo.orgName})`
      }
      userDescLeftRender={(item) => item.userInfo?.empNo}
      userDescRightRender={(item) => item.userInfo?.orgName}
      searchOrgUsersApi={({ keyword, current, pageSize }) =>
        getOrgUsers({ keyword, current, pageSize })
      }
      {...props}
    />
  )
}

export default UserSearch
