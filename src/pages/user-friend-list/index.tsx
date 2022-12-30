import { getSession } from 'next-auth/react'
import React from 'react'
import UserFriendListPage from 'views/UserFriendListPage'

function UserFriendList() {
  return (
    <div>
      <UserFriendListPage />
    </div>
  )
}

export default UserFriendList
