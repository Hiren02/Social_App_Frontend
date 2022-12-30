import {
  Avatar,
  Box,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemAvatar,
  Paper,
  Typography,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import React, { useCallback, useContext, useState } from 'react'
import debounce from 'lodash.debounce'
import { getAllUsers, getSelectedUser } from 'services/webservices/user/api'
import { GlobalContext } from 'globalContext'
import { useRouter } from 'next/router'

function SearchPage() {
  const { userData } = useContext<any>(GlobalContext)
  const [showSuggetionData, setShowSuggetionData] = useState<any>([])
  const router = useRouter()

  const searchHandler = async (event: any) => {
    const response = await getAllUsers(userData._id, event.target.value)
    // console.log(response.responseData.records)
    setShowSuggetionData(response.responseData.records)
  }

  const getSelectedUserData = async (id: string) => {
    console.log(id)
    const response = await getSelectedUser(userData._id, id)
    // console.log(response.responseData)
    if (response.responseData.self) {
      router.push('/ProfilePage')
    }
    if (response.responseData.friend) {
      router.push(`/user-friend-list/${response.responseData.friend_id}`)
    }
    if (response.responseData.other) {
      router.push(`/other-users?otherUserId=${response.responseData.other_id}`)
    }
  }
  const debounceHandler = useCallback(debounce(searchHandler, 500), [])
  return (
    <Box
      sx={{
        marginTop: '5%',
        marginLeft: '25%',
        marginRight: '20%',
        background: 'white',
        padding: '20px',
        borderRadius: '10px',
      }}
    >
      <h2>Search people</h2>
      <Paper
        component="form"
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <IconButton sx={{ p: '10px' }} aria-label="menu">
          <SearchIcon />
        </IconButton>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          onChange={debounceHandler}
          autoComplete="off"
          placeholder="Search Here..."
          inputProps={{ 'aria-label': 'search google maps' }}
        />
      </Paper>

      <List
        sx={{
          marginTop: '2%',
          marginBottom: '2%',
          maxWidth: 450,
          bgcolor: 'background.paper',
          padding: '20px',
          borderRadius: '1%',
        }}
      >
        {showSuggetionData.map((data: any) => (
          <ListItem
            className="SearchPeopleHover"
            alignItems="flex-start"
            key={data._id}
            onClick={() => {
              getSelectedUserData(data._id)
            }}
          >
            <ListItemAvatar>
              <Avatar alt="Remy Sharp" src={data.profilePhoto} />
            </ListItemAvatar>
            <Typography>{data.userName}</Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default SearchPage
