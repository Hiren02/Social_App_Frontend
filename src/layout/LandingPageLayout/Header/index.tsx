import { useEffect, useContext, useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import AdbIcon from '@mui/icons-material/Adb'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { GlobalContext } from 'globalContext'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'
import HomeIcon from '@mui/icons-material/Home'
import { Icon, Modal } from '@mui/material'
import Diversity3Icon from '@mui/icons-material/Diversity3'
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos'
import LogoutIcon from '@mui/icons-material/Logout'
import PersonIcon from '@mui/icons-material/Person'
import SearchIcon from '@mui/icons-material/Search'
import LoginIcon from '@mui/icons-material/Login'
import PsychologyIcon from '@mui/icons-material/Psychology'
import UploadPostPage from 'components/UploadPostModal'
import MarkUnreadChatAltOutlinedIcon from '@mui/icons-material/MarkUnreadChatAltOutlined'

const pages = [
  {
    title: 'Home',
    icon: <HomeIcon />,
    path: '/',
  },
  {
    title: 'Search',
    icon: <SearchIcon />,
    path: '/search',
  },
  {
    title: 'Friend Requests',
    icon: <Diversity3Icon />,
    path: '/friend-request',
  },
  {
    title: 'Chat',
    icon: <MarkUnreadChatAltOutlinedIcon />,
    path: '/user-chat',
  },
]
function ResponsiveAppBar() {
  const { userData, setUserData, flag } = useContext<any>(GlobalContext)
  const router = useRouter()
  const { status } = useSession()
  const [headerShow, setHeaderShow] = useState<boolean>(false)
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }
  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }
  useEffect(() => {
    if (status === 'authenticated') {
      setHeaderShow(true)
    } else {
      setHeaderShow(false)
    }
  }, [userData, status, flag])

  const onClickLogout = () => {
    signOut()
    router.push('/login')
    localStorage.removeItem('userData')
    localStorage.removeItem('token')
    setUserData({})
    handleCloseUserMenu()
  }
  return (
    <>
      <AppBar position="fixed" color="primary" sx={{ top: 0 }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: 'flex', md: 'none' },
              }}
            >
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              {headerShow ? (
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: 'block', md: 'none' },
                  }}
                >
                  {pages.map((page) => (
                    <Link
                      key={page.title}
                      passHref
                      href={`${page.path}`}
                      onClick={handleCloseNavMenu}
                      style={{
                        color: 'inherit',
                        textDecoration: 'none',
                        textTransform: 'capitalize',
                        padding: '20px',
                      }}
                    >
                      <table>
                        <tbody>
                          <tr>
                            <td>
                              <Icon
                                style={{
                                  height: '100%',
                                }}
                              >
                                {page.icon}
                              </Icon>
                            </td>
                            <td>
                              {' '}
                              <Typography
                                style={{
                                  marginRight: '5px',
                                }}
                              >
                                {page.title}
                              </Typography>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </Link>
                  ))}
                  <table>
                    <tbody>
                      <tr style={{ cursor: 'pointer' }} onClick={handleOpen}>
                        <td>
                          <AddToPhotosIcon style={{ color: 'black' }} />
                        </td>
                        <td>
                          <span
                            style={{
                              marginRight: '5px',
                            }}
                          >
                            Upload Post
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Menu>
              ) : null}
            </Box>
            <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              HONEYED
            </Typography>
            <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              HONEYED
            </Typography>
            {headerShow ? (
              <>
                <Box
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                    marginLeft: '65%',
                  }}
                >
                  {pages.map((page) => (
                    <Link
                      key={page.title}
                      passHref
                      href={`${page.path}`}
                      style={{
                        color: 'inherit',
                        marginRight: '20px',
                      }}
                    >
                      <Tooltip title={page.title}>
                        <Icon style={{ height: '100%' }}>{page.icon}</Icon>
                      </Tooltip>
                    </Link>
                  ))}
                  <Tooltip title="Upload Post">
                    <AddToPhotosIcon
                      onClick={handleOpen}
                      style={{
                        color: 'white',
                        marginTop: '10px',
                        cursor: 'pointer',
                      }}
                    />
                  </Tooltip>

                  <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <UploadPostPage CloseFunction={handleClose} />
                  </Modal>
                </Box>
                <Box sx={{ flexGrow: 0, ml: '30px' }}>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar alt="Remy Sharp" src={userData.profilePhoto} />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px', ml: '3px', mr: '3px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <Link
                      passHref
                      href="/profile"
                      onClick={handleCloseUserMenu}
                      style={{
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: 'inherit',
                        textDecoration: 'none',
                        textTransform: 'capitalize',
                      }}
                    >
                      <Typography sx={{ p: '5px' }}>
                        <PersonIcon />
                        Profile
                      </Typography>
                    </Link>
                    <Link
                      passHref
                      href="/change-password"
                      onClick={handleCloseUserMenu}
                      style={{
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: 'inherit',
                        textDecoration: 'none',
                        textTransform: 'capitalize',
                      }}
                    >
                      <Typography sx={{ p: '5px' }}>
                        <PsychologyIcon />
                        Change Password
                      </Typography>
                    </Link>

                    <Button
                      style={{
                        color: 'red',
                      }}
                      onClick={onClickLogout}
                    >
                      <LogoutIcon /> Logout
                    </Button>
                  </Menu>
                </Box>
              </>
            ) : (
              <Box style={{ marginLeft: '75%' }}>
                <Link
                  href="/login"
                  style={{
                    fontSize: '25px',
                    fontWeight: 700,
                    color: 'inherit',
                    textDecoration: 'none',
                    textTransform: 'capitalize',
                  }}
                >
                  <span>
                    Login
                    <LoginIcon />
                  </span>
                </Link>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <br />
      <br />
    </>
  )
}
export default ResponsiveAppBar
