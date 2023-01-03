import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { ToastContainer } from 'react-toastify'
import CardContent from '@mui/material/CardContent'
import { Col, Row } from 'react-bootstrap'
import { GlobalContext } from 'globalContext'
import {
  useContext,
  useEffect,
  useState,
  ElementType,
  ChangeEvent,
} from 'react'
import Grid from '@mui/material/Grid'
import {
  deleteOnePost,
  getOneUser,
  getAllPostsOfUser,
  twoFactorAuthToggle,
  updateProfilePhoto,
} from 'services/webservices/user/api'
import { Button, Modal, Tooltip } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import CardActions from '@mui/material/CardActions'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import FavoriteIcon from '@mui/icons-material/Favorite'
import CommentIcon from '@mui/icons-material/Comment'
import SendIcon from '@mui/icons-material/Send'
import DeleteIcon from '@mui/icons-material/Delete'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos'
import { ButtonProps } from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import toast from 'helpers/toast'
import { useRouter } from 'next/router'
import CommentsPage from 'components/CommentsModal'

const ButtonStyled = styled(Button)<
  ButtonProps & { component?: ElementType; htmlFor?: string }
>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center',
  },
}))

const ProfilePage = () => {
  const { userData, setLoginData, flag, setFlag } =
    useContext<any>(GlobalContext)
  const [userProfileData, setUserProfileData] = useState<any>('')
  const [allPostsOfUserData, setAllPostsOfUserData] = useState<any>([])
  const [dateOfBirth, setDateOfBorth] = useState<string>('')
  const [check, setCheck] = useState<boolean>(userData.twoFactorAuthentication)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [postId, setPostId] = useState<string>('')
  const [id, setId] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const [openBox, setOpenBox] = useState<boolean>(false)
  const [open, setOpen] = useState(false)
  const handleOpen = (id: string, userName: string, postId: string) => {
    setOpen(true)
    setId(id)
    setUserName(userName)
    setPostId(postId)
  }
  const handleCloseModal = () => setOpen(false)
  const router = useRouter()

  const handleClickOpen = () => {
    setOpenBox(true)
  }
  const handleCloseBox = () => {
    setOpenBox(false)
    handleClose()
  }
  useEffect(() => {
    getUserProfile()
    allPostsOfUser()
    const dateString = userData.dob
    const D = new Date(dateString)
    const Result =
      D.getDate() + '/' + (D.getMonth() + 1) + '/' + D.getFullYear()
    setDateOfBorth(Result)
  }, [userData, flag])

  const getUserProfile = async () => {
    const response = await getOneUser(userData._id, '')
    setUserProfileData(response.responseData)
  }

  const allPostsOfUser = async () => {
    const response = await getAllPostsOfUser(userData._id)
    setAllPostsOfUserData(response.responseData?.records)
  }

  const twoFactorAuthenticationFunction = async () => {
    setCheck(!check)
    userData.twoFactorAuthentication = !check
    setLoginData(userData)
    const response = await twoFactorAuthToggle(
      userData.email,
      userData._id,
      !check
    )
  }
  const onChange = async (file: ChangeEvent) => {
    setFlag(true)
    const { files } = file.target as HTMLInputElement
    if (files && files.length !== 0) {
      const data = new FormData()
      data.append('imageURL', files[0])
      data.append('userName', userData.userName)
      const response = await updateProfilePhoto(userData._id, data)
      if (response.responseCode == 200) {
        toast.success('Profile Photo updated successfully')
        userData.profilePhoto = response.responseData.profilePhoto
        setLoginData(userData)
        getUserProfile()
        setFlag(false)
      }
    }
  }
  const UserDeletePost = async (id: string) => {
    const response = await deleteOnePost(userData._id, id)
    handleCloseBox()
    allPostsOfUser()
    handleClose()
    getUserProfile()
  }

  const openDelete = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setAnchorEl(event.currentTarget)
    setPostId(id)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Card style={{ width: '80%', marginLeft: '10%', marginTop: '2%' }}>
        <ToastContainer />
        <CardContent>
          {userProfileData && (
            <Box
              sx={{
                mt: 5.75,
                mb: 8.75,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              <Row style={{ width: '100%' }}>
                <Col>
                  {userProfileData.profilePhoto ? (
                    <IconButton sx={{ p: 0 }}>
                      <Avatar
                        alt="Remy Sharp"
                        sx={{ width: 150, height: 150 }}
                        src={userProfileData.profilePhoto}
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
                  <ButtonStyled
                    component="label"
                    variant="contained"
                    htmlFor="account-settings-upload-image"
                  >
                    Update Profile
                    <input
                      hidden
                      type="file"
                      onChange={onChange}
                      accept="image/png, image/jpeg"
                      id="account-settings-upload-image"
                    />
                  </ButtonStyled>
                </Col>
                <Col>
                  <span style={{ textAlign: 'left', fontSize: '20px' }}>
                    &#x1F464; {userProfileData.userName}
                  </span>
                  <p>{userProfileData.email}</p>
                  <p> &#127874; Birth Date:-{dateOfBirth}</p>
                  <div style={{ padding: '10px' }}>
                    Two-Factor Authentication
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={check}
                        onChange={twoFactorAuthenticationFunction}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </Col>
                <Col>
                  <Box
                    className="button-1"
                    onClick={() => {
                      router.push('/friend-request')
                    }}
                  >
                    <h4>Requests</h4>
                    <br />
                    <h5>{userProfileData.requests?.length || 0}</h5>
                  </Box>
                </Col>
                <Col>
                  <Box
                    className="button-1"
                    onClick={() => {
                      router.push('/user-friend-list')
                    }}
                  >
                    <h4>Friends</h4>
                    <br />
                    <h5>{userProfileData.friends?.length || 0}</h5>
                  </Box>
                </Col>
                <Col>
                  <Box
                    className="button-1"
                    onClick={() => {
                      router.push('#posts')
                    }}
                  >
                    <h4>Posts</h4>
                    <br />
                    <h5>{userProfileData.posts?.length || 0}</h5>
                  </Box>
                </Col>
              </Row>
            </Box>
          )}
          <Box style={{ width: '100%' }} id="posts">
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              {allPostsOfUserData?.length > 0 ? (
                allPostsOfUserData.map((postData: any) => (
                  <Grid item xs={12} sm={6} md={4} key={postData.posts._id}>
                    <Card
                      style={{
                        padding: '10px',
                        borderRadius: '10px',
                        boxShadow:
                          'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px',
                      }}
                    >
                      <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={openDelete ? 'long-menu' : undefined}
                        aria-expanded={openDelete ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={(e) => handleClick(e, postData.posts._id)}
                        style={{ float: 'right' }}
                      >
                        <Tooltip title="Actions">
                          <MoreHorizIcon />
                        </Tooltip>
                      </IconButton>
                      <CardMedia
                        component="img"
                        alt="green iguana"
                        height="300"
                        image={postData.posts.imageURL}
                      />
                      <CardContent>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '800px',
                          }}
                        >
                          {postData.posts.description}
                        </Typography>
                        <span style={{ marginRight: '10px' }}>
                          <strong>{postData.posts.likesBy?.length || 0}</strong>{' '}
                          likes
                        </span>
                        <span>
                          {' '}
                          <strong>
                            {postData.posts.comments?.length || 0}
                          </strong>{' '}
                          comments
                        </span>
                      </CardContent>
                      <CardActions
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Box style={{ color: '#1976d2' }}>
                          <FavoriteIcon />
                        </Box>
                        <Box style={{ color: '#1976d2' }}>
                          <CommentIcon
                            onClick={() => {
                              handleOpen(
                                postData._id,
                                userData.userName,
                                postData.posts._id
                              )
                            }}
                          />
                        </Box>
                        <Box>
                          <SendIcon />
                        </Box>
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              ) : (
                <>
                  <Box
                    style={{
                      textAlign: 'center',
                      width: '100%',
                      padding: '80px',
                      color: '#1976D3',
                    }}
                  >
                    <h1>Share your first photo </h1>
                    <AddToPhotosIcon style={{ fontSize: '50px' }} />
                  </Box>
                </>
              )}
            </Grid>
          </Box>
        </CardContent>
      </Card>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={openDelete}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: '15ch',
          },
        }}
      >
        <MenuItem>
          <span onClick={handleClickOpen}>
            <DeleteIcon />
            Delete Post
          </span>
        </MenuItem>
      </Menu>
      <Dialog
        open={openBox}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure Delete post
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseBox}>Cancel</Button>
          <Button onClick={() => UserDeletePost(postId)} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
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
export default ProfilePage
