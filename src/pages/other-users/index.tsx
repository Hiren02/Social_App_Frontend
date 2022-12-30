import { getSession } from 'next-auth/react'
import React from 'react'
import OtherUsersPage from 'views/OtherUsersPage'

function OtherUsers() {
  return (
    <div>
      <OtherUsersPage />
    </div>
  )
}

export default OtherUsers
