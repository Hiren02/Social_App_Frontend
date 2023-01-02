// @refresh reset
import { GlobalContext } from 'globalContext'
import moment from 'moment'
import React, { useContext } from 'react'
import { useState, useEffect } from 'react'
import { deleteSingleMessage } from 'services/webservices/user/api'

function UserChatMessage({
  messageData,
  own,
  currentChat,
  getAllMessagesData,
}: any) {
  const [ownMessage, setOwnMessage] = useState<boolean>(false)
  const { userData } = useContext<any>(GlobalContext)
  useEffect(() => {
    if (own) {
      setOwnMessage(true)
    } else {
      setOwnMessage(false)
    }
  }, [own, messageData])

  const deleteChatMessage = async (id: string) => {
    const response = await deleteSingleMessage(userData._id, id)
    console.log('response', response)
    getAllMessagesData(currentChat)
  }

  return (
    <>
      {ownMessage ? (
        <>
          <p className="senderchatstyle">
            {messageData.text}
            <small style={{ fontSize: '10px', marginLeft: '5px' }}>
              {moment(messageData.createdAt).format('MMM Do YY h:mm a')}
            </small>
            <small
              className="showdeletebtn"
              onClick={() => {
                deleteChatMessage(messageData._id)
              }}
            >
              Delete
            </small>
            <div className="overlay"></div>
          </p>
        </>
      ) : (
        <p className="receivechatstyle">
          {messageData.text}
          <small style={{ fontSize: '10px', marginLeft: '5px' }}>
            {moment(messageData.createdAt).format('MMM Do YY h:mm a')}
          </small>
        </p>
      )}
    </>
  )
}

export default UserChatMessage
