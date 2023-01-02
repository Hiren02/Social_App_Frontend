import { Avatar, ListItemAvatar, ListItemText, Typography } from '@mui/material'
import { GlobalContext } from 'globalContext'
import React, { useContext, useEffect, useState } from 'react'
import { getOneUser } from 'services/webservices/user/api'

function ChatListPage({ conversationData }: any) {
  const { userData } = useContext<any>(GlobalContext)
  const [chatProfileData, setChatProfileData] = useState<any>({})

  const friendId = conversationData.members.find((m: any) => m !== userData._id)
  useEffect(() => {
    ;(async () => {
      const response = await getOneUser(userData._id, friendId)
      setChatProfileData(response.responseData)
    })()
  }, [conversationData])

  return (
    <>
      <ListItemAvatar>
        <Avatar alt="Remy Sharp" src={chatProfileData.profilePhoto} />
      </ListItemAvatar>
      <ListItemText
        style={{ overflow: 'hidden' }}
        secondary={
          <>
            <Typography
              sx={{ display: 'inline' }}
              component="span"
              variant="body2"
              color="text.primary"
            >
              <b>{chatProfileData.userName}</b>
            </Typography>
            <br />
          </>
        }
      />
    </>
  )
}

export default ChatListPage
