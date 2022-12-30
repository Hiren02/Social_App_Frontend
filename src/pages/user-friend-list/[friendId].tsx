import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Modal,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import CommentIcon from '@mui/icons-material/Comment'
import SendIcon from '@mui/icons-material/Send'
import { GlobalContext } from 'globalContext'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import {
  addLike,
  disLike,
  getOneUser,
  unFriendUser,
} from 'services/webservices/user/api'
import CommentsPage from 'components/CommentsModal'

function FriendProfilePage() {
  const { userData, flag } = useContext<any>(GlobalContext)
  const [friendData, setFriendData] = useState<any>([])
  const [id, setId] = useState<string | string[] | undefined>('')
  const [postId, setPostId] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const router = useRouter()
  const friendId = router.query.friendId
  const [open, setOpen] = useState(false)
  const handleOpen = (
    id: string | string[] | undefined,
    userName: string,
    postId: string
  ) => {
    setOpen(true)
    setId(id)
    setUserName(userName)
    setPostId(postId)
  }
  const handleCloseModal = () => setOpen(false)
  useEffect(() => {
    getFriendData()
  }, [friendId, flag])

  const getFriendData = async () => {
    if (!friendId) {
      return
    }
    const response = await getOneUser(userData._id, friendId)
    console.log(response.responseData)
    setFriendData(response.responseData)
  }

  const onClickRemoveFriend = async (id: string) => {
    const response = await unFriendUser(userData._id, id)
    response.responseCode == 200 && router.push('/search')
  }

  const onLike = async (id: string, to: string) => {
    const response = await addLike(userData._id, userData.userName, to, id)
    getFriendData()
  }

  const onDislike = async (id: string, to: string) => {
    const response = await disLike(userData._id, userData.userName, to, id)
    getFriendData()
  }

  return (
    <Card
      style={{
        width: '80%',
        marginLeft: '10%',
        marginTop: '4%',
        padding: '20px',
      }}
    >
      <Row>
        <Col style={{ textAlign: 'center', marginTop: '1%' }}>
          {friendData.profilePhoto ? (
            <IconButton sx={{ p: 0 }}>
              <Avatar
                alt="Remy Sharp"
                sx={{ width: 150, height: 150 }}
                src={friendData.profilePhoto}
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
          <h4 style={{ textAlign: 'left' }}>{friendData.userName}</h4>
          <p>{friendData.email}</p>
          <Button
            variant="contained"
            onClick={() => {
              onClickRemoveFriend(friendData._id)
            }}
          >
            Remove
          </Button>
        </Col>
        <Col style={{ textAlign: 'center', marginTop: '1%' }}>
          <h4>Friends</h4>
          <br />
          <h5>{friendData.friends?.length || 0}</h5>
        </Col>
        <Col style={{ textAlign: 'center', marginTop: '1%' }}>
          <h4>Posts</h4>
          <br />
          <h5>{friendData.posts?.length || 0}</h5>
        </Col>
      </Row>
      <Box style={{ width: '100%', marginTop: '2%' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {friendData.posts
            ? friendData.posts.map((postData: any) => (
                <Grid item xs={12} sm={6} md={4} key={postData._id}>
                  <Card
                    style={{
                      padding: '10px',
                      borderRadius: '10px',
                      boxShadow:
                        'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px',
                    }}
                  >
                    <CardMedia
                      component="img"
                      alt="green iguana"
                      height="300"
                      image={postData.imageURL}
                    />
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        {postData.description}
                      </Typography>
                      <span style={{ marginRight: '10px' }}>
                        <strong>{postData.likesBy?.length || 0}</strong> likes
                      </span>
                      <span>
                        {' '}
                        <strong>{postData.comments?.length || 0}</strong>{' '}
                        comments
                      </span>
                    </CardContent>
                    <CardActions
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box>
                        {postData.likesBy.some(
                          (item: any) => item.userName == userData.userName
                        ) ? (
                          <Button
                            onClick={() => {
                              onDislike(postData._id, friendData.userName)
                            }}
                          >
                            <FavoriteIcon />
                          </Button>
                        ) : (
                          <Button
                            onClick={() => {
                              onLike(postData._id, friendData.userName)
                            }}
                          >
                            <FavoriteBorderIcon />
                          </Button>
                        )}
                      </Box>
                      <Box>
                        <Button
                          onClick={() => {
                            handleOpen(
                              friendId,
                              friendData.userName,
                              postData._id
                            )
                          }}
                        >
                          <CommentIcon />
                        </Button>
                      </Box>
                      <Box>
                        <SendIcon />
                      </Box>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            : null}
        </Grid>
      </Box>
      <Modal
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <CommentsPage id={id} postId={postId} userName={userName} />
      </Modal>
    </Card>
  )
}

export default FriendProfilePage
