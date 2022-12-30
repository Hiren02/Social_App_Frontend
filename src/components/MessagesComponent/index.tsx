// @refresh reset
import moment from 'moment'
import React from 'react'
import { useState, useEffect } from 'react'

function UserChatMessage({ messageData, own }: any) {
  const [ownMessage, setOwnMessage] = useState<boolean>(false)

  useEffect(() => {
    if (own) {
      setOwnMessage(true)
    } else {
      setOwnMessage(false)
    }
  }, [own])

  return (
    <>
      {ownMessage ? (
        <p
          style={{
            textAlign: 'right',
            fontSize: '20px',
            fontFamily: 'revert',
            marginRight: '10px',
            marginLeft: '50%',
            padding: '2px',
            background: '#9addfb',
            borderRadius: '10px',
            marginTop: '10px',
            wordWrap: 'break-word',
            textJustify: 'inter-word',
          }}
        >
          {messageData.text}
          <small style={{ fontSize: '10px', marginLeft: '5px' }}>
            {moment(messageData.createdAt).format('MMM Do YY h:mm a')}
          </small>
        </p>
      ) : (
        <p
          style={{
            textAlign: 'left',
            fontSize: '20px',
            fontFamily: 'revert',
            marginLeft: '10px',
            marginRight: '50%',
            padding: '2px',
            background: '#d8f9ff',
            borderRadius: '10px',
            marginTop: '10px',
            width: '50%',
            wordWrap: 'break-word',
            textJustify: 'inter-word',
          }}
        >
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
