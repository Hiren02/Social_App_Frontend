import { Button } from '@mui/material'
import { Box } from '@mui/system'
import React, { useContext, useEffect, useRef, useState } from 'react'
import {
  addComment,
  addReplyToComment,
  deleteCommentReply,
  deleteOneComment,
  getAllComments,
} from 'services/webservices/user/api'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { GlobalContext } from 'globalContext'
import SendIcon from '@mui/icons-material/Send'
import CloseIcon from '@mui/icons-material/Close'

interface MyValues {
  typedComment: string
}

function CommentsPage({ id, postId, userName }: any) {
  const { userData, setFlag } = useContext<any>(GlobalContext)
  const [commentsData, setCommentsData] = useState<any>({})
  const [commentorUserName, setCommentorUserName] = useState('')
  const [commentId, setCommentId] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useRef<any>(null)

  useEffect(() => {
    getAllCommentsData()
  }, [])

  const getAllCommentsData = async () => {
    const response = await getAllComments(userData._id, id, postId)
    // console.log(response.responseData.records)
    setCommentsData(response.responseData.records)
  }

  const onclickSetFocus = (userName: string, id: string) => {
    ref.current.focus()
    setCommentorUserName(userName)
    setCommentId(id)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setCommentorUserName('')
    setCommentId('')
  }

  const onClickDeleteComment = async (id: string) => {
    setFlag(true)
    const response = await deleteOneComment(userData._id, userName, postId, id)
    if (response.responseCode == 200) {
      getAllCommentsData()
      setFlag(false)
    }
  }

  const onClickDeleteCommentReply = async (
    comment_id: string,
    commentReply_id: string
  ) => {
    setFlag(true)
    const response = await deleteCommentReply(
      userData._id,
      userName,
      userData.userName,
      postId,
      comment_id,
      commentReply_id
    )
    if (response.responseCode == 200) {
      getAllCommentsData()
      setFlag(false)
    }
  }

  const validateSchema = Yup.object().shape({
    typedComment: Yup.string().trim().required('Comment is required.'),
  })

  const {
    handleSubmit: handleSubmit1,
    handleChange: handleChange1,
    errors: error1,
    touched: touched1,
    values: values1,
  } = useFormik<MyValues>({
    initialValues: {
      typedComment: '',
    },
    validationSchema: validateSchema,

    onSubmit: async (values1: any, { resetForm }) => {
      if (commentorUserName == '') {
        setFlag(true)
        const response = await addComment(
          userData._id,
          userData.userName,
          userName,
          postId,
          values1.typedComment
        )
        if (response.responseCode == 200) {
          getAllCommentsData()
          resetForm()
          setFlag(false)
        }
      } else {
        setFlag(true)
        const response = await addReplyToComment(
          userData._id,
          userName,
          userData.userName,
          commentorUserName,
          postId,
          commentId,
          values1.typedComment
        )
        if (response.responseCode == 200) {
          getAllCommentsData()
          resetForm()
          setCommentorUserName('')
          setCommentId('')
          setOpen(false)
          setFlag(false)
        }
      }
    },
  })

  return (
    <>
      <Box
        style={{
          width: '40%',
          marginLeft: '30%',
          marginRight: '20%',
          padding: '20px',
          background: 'white',
          marginTop: '2%',
          boxShadow:
            'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px',
          borderRadius: '10px',
        }}
      >
        <h2>Comments</h2>
        <Box
          style={{
            maxHeight: '350px',
            overflowX: 'auto',
          }}
        >
          {commentsData.length > 0 ? (
            commentsData.map((comment: any) => (
              <Box>
                <table style={{ marginTop: '10px' }}>
                  <tbody>
                    <tr>
                      <td>
                        <span>
                          <strong>{comment.posts.comments.userName}</strong>{' '}
                          {comment.posts.comments.description}
                        </span>
                      </td>
                      <td>
                        {comment.posts.comments.userName ==
                          userData.userName && (
                          <span
                            onClick={() => {
                              onClickDeleteComment(comment.posts.comments._id)
                            }}
                            style={{
                              color: 'red',
                              textDecoration: 'underline',
                              fontSize: '12px',
                              marginLeft: '10px',
                              cursor: 'pointer',
                            }}
                          >
                            Delete
                          </span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <Button
                  style={{ textTransform: 'capitalize' }}
                  onClick={() => {
                    onclickSetFocus(
                      comment.posts.comments.userName,
                      comment.posts.comments._id
                    )
                  }}
                >
                  Reply
                </Button>

                {comment.posts.comments.commentReplies.length > 0 &&
                  comment.posts.comments.commentReplies.map(
                    (commentReply: any) => (
                      <table
                        style={{
                          marginLeft: '100px',
                        }}
                      >
                        <tbody>
                          <tr>
                            <td>
                              <strong>{commentReply.from}</strong>
                            </td>
                            <td>{commentReply.reply}</td>
                            <td>
                              {commentReply.from == userData.userName && (
                                <span
                                  onClick={() => {
                                    onClickDeleteCommentReply(
                                      comment.posts.comments._id,
                                      commentReply._id
                                    )
                                  }}
                                  style={{
                                    color: 'red',
                                    textDecoration: 'underline',
                                    fontSize: '12px',
                                    marginLeft: '10px',
                                    cursor: 'pointer',
                                  }}
                                >
                                  Delete
                                </span>
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={2}>
                              <Button
                                style={{ textTransform: 'capitalize' }}
                                onClick={() => {
                                  onclickSetFocus(
                                    comment.posts.comments.userName,
                                    comment.posts.comments._id
                                  )
                                }}
                              >
                                Reply
                              </Button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    )
                  )}
              </Box>
            ))
          ) : (
            <h4
              style={{ color: '#333333', textAlign: 'center', padding: '50px' }}
            >
              No comments yet
            </h4>
          )}
        </Box>
        {open && (
          <Box>
            <span>Replying to Comment</span>
            <Button onClick={handleClose}>
              <CloseIcon />
            </Button>
          </Box>
        )}
        <form onSubmit={handleSubmit1}>
          <input
            ref={ref}
            type="text"
            placeholder="Type hear...."
            value={values1.typedComment}
            onChange={async (e) => {
              handleChange1('typedComment')(e)
            }}
            style={{
              border: 'none',
              outline: 'none',
              borderBottom: '1px solid #009AEE',
              paddingLeft: '5px',
              background: 'transparent',
              fontSize: '18px',
              fontWeight: 'bold',
              fontFamily: 'revert-layer',
            }}
          />

          <Button type="submit" sx={{ marginRight: 3.5, marginTop: '10px' }}>
            <SendIcon />
          </Button>

          {touched1.typedComment && error1.typedComment ? (
            <div style={{ marginBottom: '15px' }}>
              <div className="fv-help-block" style={{ color: '#ff6c70' }}>
                {error1.typedComment}
              </div>
            </div>
          ) : null}
        </form>
      </Box>
    </>
  )
}

export default CommentsPage
