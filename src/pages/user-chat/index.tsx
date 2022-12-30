import React, { useContext, useEffect, useRef, useState } from 'react'
import Chatlistcomponent from 'components/ChatListComponent'
import Messagescomponent from 'components/MessagesComponent'
import { Box } from '@mui/system'
import Grid from '@mui/material/Grid'
import AddIcon from '@mui/icons-material/Add'
import InputEmoji from 'react-input-emoji'
import ClearIcon from '@mui/icons-material/Clear'
import {
  deleteChatUser,
  getAllConversations,
  getAllMessages,
  getAllUsers,
  newConversation,
  sendMessage,
} from 'services/webservices/user/api'
import { GlobalContext } from 'globalContext'
import {
  Avatar,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Modal,
  Tooltip,
  Typography,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import chatgif from '../../../public/images/chat.gif'
import Image from 'next/image'
import toast from 'helpers/toast'
import { ToastContainer } from 'react-toastify'
import { io } from 'socket.io-client'

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 350,
  maxHeight: 500,
  bgcolor: 'white',
  p: 2,
  overflowX: 'auto',
}

function UserChatPage() {
  const { userData, setFlag, flag } = useContext<any>(GlobalContext)
  const [message, setMessage] = useState('')
  const [showTextBox, setShowTextBox] = useState<boolean>(false)
  const [hidebtn, setHidebtn] = useState(false)
  const [conversationData, setConversationData] = useState<any>([])
  const [messagesData, setMessagesData] = useState<any>([])
  const [conversationId, setConversationId] = useState<any>()
  const [currentChat, setCurrentChat] = useState<any>(null)
  const [arrivalMessage, setArrivalMessage] = useState<any>(null)
  const [open, setOpen] = React.useState(false)
  const [allUserList, setAllUserList] = useState<any>([])
  const [active, setActive] = useState(null)
  const scrollRef = useRef<any>()
  const socket = useRef<any>()

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messagesData, flag])

  useEffect(() => {
    if (message.trim() == '') {
      setHidebtn(true)
    } else {
      setHidebtn(false)
    }
  }, [message, flag])

  useEffect(() => {
    if (currentChat) {
      socket.current = io('http://localhost:7000')
      socket.current.emit('add-user', userData._id)
    }
  }, [currentChat, flag])

  useEffect(() => {
    getAllChatData()
  }, [flag])

  const handleOpen = () => {
    setOpen(true)
    getAllUserList()
  }
  const handleClose = () => setOpen(false)

  const getAllChatData = async () => {
    const response = await getAllConversations(userData._id)
    setConversationData(response.responseData)
  }
  const getAllUserList = async () => {
    const response = await getAllUsers(userData._id, '')
    setAllUserList(response.responseData.records)
  }
  const getAllMessagesData = async (data: any) => {
    setActive(data)
    setConversationId(data._id)
    setCurrentChat(data)
    const response = await getAllMessages(userData._id, data._id)
    setMessagesData(response.responseData)
    setShowTextBox(true)
  }

  const sendMessageFunction = async (e: any) => {
    e.preventDefault()

    const receiverId = currentChat.members.find(
      (member: any) => member !== userData._id
    )
    socket.current.emit('send-msg', {
      to: receiverId,
      from: userData._id,
      msg: message,
    })
    const response = await sendMessage(userData._id, message, conversationId)
    // console.log('response responseData', response.responseData)
    setMessagesData([...messagesData, response.responseData])
    setMessage('')
  }

  useEffect(() => {
    console.log('data ave chhe joto')
    if (socket.current) {
      socket.current.on('msg-recieve', (data: any) => {
        setArrivalMessage({
          sender: data.from,
          text: data.msg,
          createdAt: Date.now(),
        })
      })
    }
  }, [messagesData, flag])
  useEffect(() => {
    console.log('send rev', currentChat?.members, arrivalMessage?.sender)

    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessagesData((prev: any) => [...prev, arrivalMessage])
  }, [arrivalMessage, currentChat, flag])

  const startNewConversation = async (receiverId: string) => {
    setFlag(true)
    const response = await newConversation(userData._id, receiverId)

    if (response.responseCode == 400) {
      toast.info(response.responseMessage)
    } else {
      toast.success(response.responseMessage)
      setOpen(false)
      setFlag(false)
    }
  }

  const deleteChatUserfunction = async (id: string) => {
    if (confirm('are you sure delete conversation with messages') == true) {
      const response1 = await deleteChatUser(userData._id, id)
      getAllChatData()
      setCurrentChat(null)
      setShowTextBox(false)
    } else {
    }
  }

  return (
    <>
      <Box
        sx={{
          flexGrow: 1,
          marginTop: '2%',
          marginLeft: '10%',
        }}
      >
        <ToastContainer />
        <Grid container columns={18}>
          <Grid item xs={10} style={{ marginRight: '20px' }}>
            {currentChat ? (
              <Box
                style={{
                  background: 'white',
                  borderRadius: '10px',
                  height: '430px',
                  overflowX: 'auto',
                }}
              >
                {messagesData.map((messageData: any) => (
                  <div ref={scrollRef}>
                    <Messagescomponent
                      messageData={messageData}
                      own={messageData.sender == userData._id}
                    />
                  </div>
                ))}
              </Box>
            ) : (
              <>
                <Box
                  style={{
                    background: 'white',
                    borderRadius: '10px',
                    height: '430px',
                    overflowX: 'auto',
                  }}
                >
                  <h3 style={{ textAlign: 'center' }}>
                    Open a conversation to start a chat.
                  </h3>
                  <Image
                    style={{ marginLeft: '25%', marginTop: '8%' }}
                    src={chatgif}
                    alt="1"
                    height={300}
                    width={300}
                  />
                </Box>
              </>
            )}
            {showTextBox && (
              <form onSubmit={sendMessageFunction}>
                <div
                  style={{
                    marginTop: '10px',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <InputEmoji
                    onKeyDown={(e: any) => {
                      if (e.keyCode === 13) {
                        sendMessageFunction(e)
                      }
                    }}
                    type="text"
                    name="message"
                    placeholder="Type message"
                    value={message}
                    onChange={(e: any) => {
                      setMessage(e)
                    }}
                  />

                  {hidebtn ? (
                    <Button
                      disabled
                      type="submit"
                      style={{
                        border: 'none',
                        color: 'black',
                        marginRight: '20px',
                      }}
                    >
                      <SendIcon />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      style={{
                        border: 'none',
                        color: '#1976d3',
                      }}
                    >
                      <SendIcon />
                    </Button>
                  )}
                </div>
              </form>
            )}
          </Grid>

          <Box
            style={{
              background: 'white',
              width: '350px',
              borderRadius: '10px',
            }}
          >
            <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span
                style={{
                  marginLeft: '20px',
                  marginTop: '10px',
                  fontSize: '25px',
                  fontWeight: '300',
                }}
              >
                Chats
              </span>
              <Tooltip title="Start New Chat">
                <Button
                  style={{ fontWeight: '900', color: '#1976d3' }}
                  onClick={handleOpen}
                >
                  <AddIcon />
                </Button>
              </Tooltip>
            </Box>
            <hr />
            <Grid
              style={{
                maxHeight: '400px',
                overflowX: 'auto',
              }}
            >
              {conversationData.map((data: any) => (
                <>
                  <Box
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <ListItem
                      className={`SearchPeopleHoverlistactive ${
                        active == data && 'active'
                      }`}
                      onClick={() => {
                        getAllMessagesData(data)
                      }}
                    >
                      <> {console.log('data', data)}</>
                      <Chatlistcomponent conversationData={data} />
                    </ListItem>
                    <ClearIcon
                      className="ClearChatButton"
                      onClick={() => {
                        deleteChatUserfunction(data._id)
                      }}
                    />
                  </Box>
                </>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h5> Start New Conversation</h5>
          {allUserList.map((userlistdata: any) => (
            <List
              onClick={() => {
                startNewConversation(userlistdata._id)
              }}
            >
              <ListItem className="SearchPeopleHover">
                <>
                  <ListItemAvatar>
                    <Avatar alt="Remy Sharp" src={userlistdata.profilePhoto} />
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
                          <b>{userlistdata.userName}</b>
                        </Typography>
                        <br />
                      </>
                    }
                  />
                </>
              </ListItem>
            </List>
          ))}
        </Box>
      </Modal>
    </>
  )
}

export default UserChatPage
