import { getSession } from 'next-auth/react'
import React from 'react'
import ChangePasswordPage from 'views/ChangePasswordPage'

function ChangePassword() {
  return (
    <div>
      <ChangePasswordPage />
    </div>
  )
}

export default ChangePassword
