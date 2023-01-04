import { useContext, useEffect, useState } from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import {
  acceptFriendRequest,
  sendRequest,
  cancelFriendRequest,
  getAllRequests,
  getAllSuggetions,
  rejectFriendRequest,
} from 'services/webservices/user/api'
import { GlobalContext } from 'globalContext'
import { Button } from '@mui/material'
import Divider from '@mui/material/Divider'
import { Box } from '@mui/system'
import { useRouter } from 'next/router'

function FriendRequest() {
  const { userData, setRequestCount, requestCount } =
    useContext<any>(GlobalContext)
  const [friendSuggetionList, setFriendSuggetionList] = useState<any>([])
  const [allRequests, setAllRequests] = useState<any>([])
  const router = useRouter()
  setRequestCount(allRequests.length)

  useEffect(() => {
    getAllSuggetionsList()
    getAllRequestsForUser()
  }, [])

  const getAllSuggetionsList = async () => {
    const result = await getAllSuggetions(userData._id)
    const reqData = result.responseData.records
    setFriendSuggetionList(reqData)
  }
  const getAllRequestsForUser = async () => {
    const response = await getAllRequests(userData._id)
    setAllRequests(response.responseData.records)
  }

  const onClickSendRequest = async (id: string) => {
    const response = await sendRequest(userData._id, id)
    if (response.responseCode == 200) {
      getAllSuggetionsList()
      getAllRequestsForUser()
    }
  }
  const cancelRequest = async (id: string) => {
    const response = await cancelFriendRequest(userData._id, id)
    if (response.responseCode == 200) {
      getAllSuggetionsList()
      getAllRequestsForUser()
    }
  }

  const acceptRequest = async (id: string) => {
    const response = await acceptFriendRequest(userData._id, id)
    if (response.responseCode == 200) {
      getAllSuggetionsList()
      getAllRequestsForUser()
    }
  }
  const rejectRequest = async (id: string) => {
    const response = await rejectFriendRequest(userData._id, id)
    console.log(response)
    if (response.responseCode == 200) {
      getAllSuggetionsList()
      getAllRequestsForUser()
    }
  }

  return (
    <Box>
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
        <h4>Pending Requests</h4>
        {allRequests.map((data: any) => (
          <ListItem alignItems="flex-start" key={data._id}>
            <ListItemAvatar>
              <Avatar alt="Remy Sharp" src={data.requestsInfo.profilePhoto} />
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
                    <b>{data.requestsInfo.userName}</b>
                  </Typography>
                  <br />
                </>
              }
            />
            <Button
              style={{ marginLeft: '2px' }}
              onClick={() => acceptRequest(data.requestsInfo._id)}
            >
              Accept
            </Button>
            <Button
              style={{ marginLeft: '2px' }}
              onClick={() => rejectRequest(data.requestsInfo._id)}
            >
              Reject
            </Button>
          </ListItem>
        ))}
      </List>
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
        <h4>Suggetions</h4>
        {friendSuggetionList.map((data: any) => (
          <>
            {!allRequests.some(
              (item: any) => item.requestsInfo._id == data._id
            ) && (
              <ListItem
                alignItems="flex-start"
                key={data._id}
                className="SearchPeopleHover"
              >
                <ListItemAvatar
                  onClick={() => {
                    router.push(`/other-users?otherUserId=${data._id}`)
                  }}
                >
                  <Avatar alt="Remy Sharp" src={data.profilePhoto} />
                </ListItemAvatar>
                <ListItemText
                  onClick={() => {
                    router.push(`/other-users?otherUserId=${data._id}`)
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
                />

                {data.requests.some((item: any) => item._id == userData._id) ? (
                  <Button
                    style={{
                      marginLeft: '2px',
                      background: '#169FFF',
                      color: 'white',
                      fontSize: '13px',
                      fontWeight: 'bold',
                    }}
                    onClick={() => {
                      cancelRequest(data._id)
                    }}
                  >
                    Requested
                  </Button>
                ) : (
                  <Button
                    style={{
                      marginLeft: '2px',
                      // background: '#169FFF',
                      color: '#169FFF',
                      fontSize: '13px',
                      fontWeight: 'bold',
                    }}
                    onClick={() => onClickSendRequest(data._id)}
                  >
                    Send Request
                  </Button>
                )}
              </ListItem>
            )}
            <Divider variant="inset" component="li" />
          </>
        ))}
      </List>
    </Box>
  )
}
export default FriendRequest
