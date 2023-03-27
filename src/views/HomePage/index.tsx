import {
  CardActions,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Tooltip,
  Typography,
} from '@mui/material'
import Card from '@mui/material/Card'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import CommentIcon from '@mui/icons-material/Comment'
import SendIcon from '@mui/icons-material/Send'
import Twitter from 'mdi-material-ui/Twitter'
import Facebook from 'mdi-material-ui/Facebook'
import Linkedin from 'mdi-material-ui/Linkedin'
import GooglePlus from 'mdi-material-ui/GooglePlus'
import { GlobalContext } from 'globalContext'
import Box from '@mui/material/Box'
import React, { useContext, useEffect, useState, MouseEvent } from 'react'
import {
  addLike,
  disLike,
  getAllRequests,
  getFriendPosts,
} from 'services/webservices/user/api'
import { Container } from '@mui/system'
import { useRouter } from 'next/router'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'
import Diversity3Icon from '@mui/icons-material/Diversity3'
import Link from 'next/link'
import InfiniteScroll from 'react-infinite-scroll-component'
import CommentsPage from 'components/CommentsModal'
import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'

function HomePage() {
  const { userData, flag, setRequestCount } = useContext<any>(GlobalContext)
  const [friendPostsListData, setFriendPostsListData] = useState<any>([])
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [skip, setSkip] = useState<number>(0)
  const [id, setId] = useState<string>('')
  const [postId, setPostId] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const openShareIcon = Boolean(anchorEl)
  const [open, setOpen] = useState(false)
  const session = useSession()
  console.log('session', session)
  const handleOpen = (id: string, userName: string, postId: string) => {
    setOpen(true)
    setId(id)
    setUserName(userName)
    setPostId(postId)
  }
  const handleCloseModal = () => setOpen(false)
  const router = useRouter()
  useEffect(() => {
    getFriendPostsList()
    getAllrequestCount()
  }, [flag])

  const getAllrequestCount = async () => {
    const response = await getAllRequests(userData._id)
    console.log(response)
    setRequestCount(response?.responseData?.records?.length)
  }

  const fetchMoreData = () => {
    setSkip(skip + 3)
    setTimeout(async () => {
      const response = await getFriendPosts(userData._id, skip + 3, '3')
      setFriendPostsListData(
        friendPostsListData.concat(response.responseData.records)
      )
    }, 300)
  }

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const getFriendPostsList = async () => {
    const response = await getFriendPosts(userData._id, 0, '3')
    if (response.responseData == undefined) {
      signOut({ redirect: false })
    } else {
      setFriendPostsListData(response.responseData.records)
    }
  }
  const onLike = async (id: string, to: string) => {
    setLoading(true)
    const response = await addLike(userData._id, userData.userName, to, id)
    let index = friendPostsListData.findIndex(
      (item: any) => item.posts._id == id
    )
    let updatedArray = [
      ...friendPostsListData[index].posts.likesBy,
      {
        userName: userData.userName,
      },
    ]
    friendPostsListData[index].posts.likesBy = updatedArray
    setLoading(false)
  }
  const onDislike = async (id: string, to: string) => {
    setLoading(true)
    const response = await disLike(userData._id, userData.userName, to, id)
    let index = friendPostsListData.findIndex(
      (item: any) => item.posts._id == id
    )
    friendPostsListData[index].posts.likesBy.pop()
    setLoading(false)
  }

  return (
    <>
      <InfiniteScroll
        dataLength={friendPostsListData.length}
        next={fetchMoreData}
        hasMore={true}
        loader={<p></p>}
      >
        {friendPostsListData.length > 0 ? (
          friendPostsListData.map((data: any) => (
            <Card key={data.posts._id} className="postcardhomepage">
              <Container>
                <table style={{ width: '100%' }}>
                  <tbody>
                    <tr>
                      <td style={{ width: '51px' }}>
                        <img
                          onClick={() => {
                            router.push(`/user-friend-list/${data._id}`)
                          }}
                          alt="Robert Meyer"
                          src={data.profilePhoto}
                          style={{
                            width: 50,
                            height: 50,
                            left: '1.313rem',
                            borderRadius: '100%',
                            cursor: 'pointer',
                          }}
                        />
                      </td>
                      <td>
                        <Typography
                          onClick={() => {
                            router.push(`/user-friend-list/${data._id}`)
                          }}
                          sx={{ marginLeft: '10px', cursor: 'pointer' }}
                        >
                          <strong>{data.userName}</strong>
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

                <img
                  alt="green iguana"
                  height="500px"
                  width="100%"
                  style={{ marginTop: '5%' }}
                  src={data.posts.imageURL}
                />
                <CardContent>
                  <CardActions>
                    {data.posts.likesBy.some(
                      (item: any) => item.userName == userData.userName
                    ) ? (
                      <Tooltip title="Dislike">
                        <FavoriteIcon
                          style={{
                            marginRight: '10px',
                            color: '#1976d3',
                            cursor: 'pointer',
                          }}
                          onClick={() => {
                            onDislike(data.posts._id, data.userName)
                          }}
                        />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Like">
                        <FavoriteBorderIcon
                          style={{ marginRight: '10px', cursor: 'pointer' }}
                          onClick={() => {
                            onLike(data.posts._id, data.userName)
                          }}
                        />
                      </Tooltip>
                    )}
                    <Tooltip title="Comment">
                      <CommentIcon
                        style={{
                          marginRight: '10px',
                          color: '#1976d3',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          handleOpen(data._id, data.userName, data.posts._id)
                        }}
                      />
                    </Tooltip>

                    <Box>
                      <IconButton
                        style={{ color: '#1976d3' }}
                        id="long-button"
                        aria-label="share"
                        aria-haspopup="true"
                        onClick={handleClick}
                        aria-controls="long-menu"
                        aria-expanded={openShareIcon ? 'true' : undefined}
                      >
                        <Tooltip title="Share">
                          <SendIcon />
                        </Tooltip>
                      </IconButton>
                      <Menu
                        open={openShareIcon}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        MenuListProps={{
                          'aria-labelledby': 'long-button',
                        }}
                      >
                        <MenuItem onClick={handleClose}>
                          <Facebook style={{ color: '#1976d3' }} />
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                          <Twitter style={{ color: '#1976d3' }} />
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                          <Linkedin style={{ color: '#1976d3' }} />
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                          <GooglePlus style={{ color: '#1976d3' }} />
                        </MenuItem>
                      </Menu>
                    </Box>
                  </CardActions>
                  <span style={{ marginRight: '10px' }}>
                    <strong>{data.posts.likesBy?.length || 0}</strong> likes
                  </span>
                  <span>
                    <strong>{data.posts.comments?.length || 0}</strong> comments
                  </span>
                  <Typography variant="body2" color="text.secondary">
                    <strong>{data.userName}</strong> {data.posts.description}
                  </Typography>
                </CardContent>
              </Container>
            </Card>
          ))
        ) : (
          <>
            <Box
              style={{
                marginTop: '2%',
                width: '80%',
                marginLeft: '10%',
                background: 'white',
                padding: '10px',
              }}
            >
              <Link
                href="/friend-request"
                style={{
                  color: '#1976d2',
                  marginLeft: '350px',
                  textDecoration: 'none',
                }}
              >
                <span>
                  <h3 style={{ textAlign: 'center' }}>
                    You don't have any friends please Go to Friend request page
                  </h3>
                  <ArrowRightAltIcon
                    sx={{ fontSize: 100, marginLeft: '350px' }}
                  />
                  <Diversity3Icon sx={{ fontSize: 100 }} />
                </span>
              </Link>
            </Box>
          </>
        )}
      </InfiniteScroll>
      <Modal
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <CommentsPage id={id} postId={postId} userName={userName} />
      </Modal>
    </>
  )
}

export default HomePage
