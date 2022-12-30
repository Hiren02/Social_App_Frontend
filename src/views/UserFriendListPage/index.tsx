import {
  Avatar,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material'
import { GlobalContext } from 'globalContext'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import { getUserFriends, unFriendUser } from 'services/webservices/user/api'

function UserFriendListPage() {
  const { userData } = useContext<any>(GlobalContext)
  const router = useRouter()

  const [userFriendsListData, setUserFriendsListData] = useState<any>([])
  useEffect(() => {
    getUserFriendsList()
  }, [])

  const getUserFriendsList = async () => {
    const response = await getUserFriends(userData._id)
    setUserFriendsListData(response.responseData.records)
  }

  const onClickRemoveFriend = async (id: string) => {
    const response = await unFriendUser(userData._id, id)
    getUserFriendsList()
  }

  return (
    <List
      sx={{
        width: '80%',
        marginRight: '10%',
        marginLeft: '30%',
        marginTop: '2%',
        marginBottom: '2%',
        maxWidth: 450,
        bgcolor: 'background.paper',
        padding: '20px',
        borderRadius: '1%',
      }}
    >
      <h4>FRIENDS LIST</h4>
      {userFriendsListData.map((data: any) => (
        <ListItem
          className="SearchPeopleHover"
          alignItems="flex-start"
          key={data._id}
        >
          <ListItemAvatar
            onClick={() => {
              router.push(`/user-friend-list/${data._id}`)
            }}
          >
            <Avatar alt="Remy Sharp" src={data.profilePhoto} />
          </ListItemAvatar>
          <ListItemText
            onClick={() => {
              router.push(`/user-friend-list/${data._id}`)
            }}
            style={{ overflow: 'hidden' }}
            secondary={
              <>
                <Typography
                  sx={{ display: 'inline' }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  <b>{data.userName}</b>
                </Typography>
                <br />
              </>
            }
          />{' '}
          <Button
            style={{ marginLeft: '2px' }}
            onClick={() => {
              onClickRemoveFriend(data._id)
            }}
          >
            Remove
          </Button>
        </ListItem>
      ))}
    </List>
  )
}

export default UserFriendListPage
