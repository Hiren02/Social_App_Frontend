import { IconButton, Typography } from '@mui/material'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { GlobalContext } from 'globalContext'
import React, { useContext, useEffect, useState } from 'react'
import { getOneUser } from 'services/webservices/user/api'

function ChatHeader({ currentChat }: any) {
  const { userData } = useContext<any>(GlobalContext)
  const [chatProfileData, setChatProfileData] = useState<any>({})

  const friendId = currentChat.members.find((m: any) => m !== userData._id)
  useEffect(() => {
    ;(async () => {
      const response = await getOneUser(userData._id, friendId)
      setChatProfileData(response.responseData)
    })()
  }, [currentChat])
  return (
    <table style={{ width: '100%' }}>
      <tbody>
        <tr>
          <td style={{ width: '51px' }}>
            <img
              alt="Robert Meyer"
              src={chatProfileData.profilePhoto}
              style={{
                width: 50,
                height: 50,
                margin: 6,
                left: '1.313rem',
                borderRadius: '100%',
                cursor: 'pointer',
              }}
            />
          </td>
          <td>
            <Typography sx={{ cursor: 'pointer' }}>
              <strong>{chatProfileData.userName}</strong>
            </Typography>
          </td>
          <td>
            <IconButton sx={{ float: 'right' }}>
              <MoreHorizIcon />
            </IconButton>
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export default ChatHeader
