import { GlobalContext } from 'globalContext'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import {
  cancelFriendRequest,
  getOneUser,
  sendRequest,
} from 'services/webservices/user/api'
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import { Col, Row } from 'react-bootstrap'

function OtherUsersPage() {
  const { userData } = useContext<any>(GlobalContext)
  const [otherUserData, setOtherUserData] = useState<any>([])
  const router = useRouter()
  const otherUserId = router.query.otherUserId

  useEffect(() => {
    getOtherUserData()
  }, [otherUserId])

  const getOtherUserData = async () => {
    if (!otherUserId) {
      return
    }
    const response = await getOneUser(userData._id, otherUserId)
    console.log(response.responseData)
    setOtherUserData(response.responseData)
  }

  const onClickSendRequest = async (id: string) => {
    const response = await sendRequest(userData._id, id)
    console.log(response)
    getOtherUserData()
  }
  const cancelRequest = async (id: string) => {
    const response = await cancelFriendRequest(userData._id, id)
    console.log(response)
    getOtherUserData()
  }

  return (
    <Card style={{ width: '80%', marginLeft: '10%', marginTop: '4%' }}>
      <Row>
        <Col style={{ textAlign: 'center', marginTop: '1%' }}>
          {otherUserData.profilePhoto ? (
            <IconButton sx={{ p: 0 }}>
              <Avatar
                alt="Remy Sharp"
                sx={{ width: 150, height: 150 }}
                src={otherUserData.profilePhoto}
              />
            </IconButton>
          ) : (
            <IconButton sx={{ p: 0 }}>
              <Avatar
                alt="Remy Sharp"
                sx={{ width: 150, height: 150 }}
                src="/public/images/avatars/2.png"
              />
            </IconButton>
          )}
        </Col>
        <Col style={{ marginTop: '1%' }}>
          {' '}
          <h4 style={{ textAlign: 'left' }}>{otherUserData.userName}</h4>
          <p>{otherUserData.email}</p>
          {otherUserData.requests &&
          otherUserData.requests.some(
            (item: any) => item._id == userData._id
          ) ? (
            <Button
              onClick={() => {
                cancelRequest(otherUserData._id)
              }}
            >
              Requested
            </Button>
          ) : (
            <Button
              style={{ marginLeft: '2px' }}
              onClick={() => onClickSendRequest(otherUserData._id)}
            >
              Send Request
            </Button>
          )}
        </Col>
        <Col style={{ textAlign: 'center', marginTop: '1%' }}>
          <h4>Friends</h4>
          <br />
          <h5>{otherUserData.friends?.length || 0}</h5>
        </Col>
        <Col style={{ textAlign: 'center', marginTop: '1%' }}>
          <h4>Posts</h4>
          <br />
          <h5>{otherUserData.posts?.length || 0}</h5>
        </Col>
      </Row>
    </Card>
  )
}

export default OtherUsersPage
