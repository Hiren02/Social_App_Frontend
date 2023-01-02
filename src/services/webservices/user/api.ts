// import { API_URL } from 'services/config'
import api from '../../../utils/APICall'
import { APIEndpoints } from 'services/endPoint'
import { addUserDetails } from './userInformation'

export const register = async (
  userName: string,
  email: string,
  password: string,
  dob: string,
  gender: string
) => {
  return api(`${APIEndpoints.register}`, 'POST', {
    userName,
    email,
    password,
    dob,
    gender,
  })
}

export const login = async (userDetail: {
  email: string
  password: string
  role: string
}) => {
  const loginDetails = await addUserDetails(userDetail)
  return api(`${APIEndpoints.login}`, 'POST', loginDetails)
}

export const verifySecurityCode = async (otp: string, userId: string) => {
  return api(`${APIEndpoints.verifySecurityCode}/${userId}`, 'POST', {
    OTP: otp,
  })
}

export const resendVerificationCode = async (
  email: string,
  resendOTP: boolean
) => {
  return api(`${APIEndpoints.resendCode}`, 'POST', { email, resendOTP })
}

export const getAllUsers = (userId: string, key?: string) => {
  return api(`${APIEndpoints.getAllUsers}?id=${userId}&key=${key}`, 'GET')
}

export const getSelectedUser = (userId: string, selectedUserId: string) => {
  return api(
    `${APIEndpoints.getSelectedUser}?userId=${userId}&selectedId=${selectedUserId}`,
    'GET'
  )
}

export const forgotPassword = async (email: string) => {
  return api(`${APIEndpoints.forgotPassword}`, 'POST', { email })
}

export const setNewPassword = async (
  UpdatePassword: string,
  verifyLink: string
) => {
  return api(`${APIEndpoints.setNewPassword}/${verifyLink}`, 'POST', {
    password: UpdatePassword,
  })
}

export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  return api(`${APIEndpoints.changePassword}/${userId}`, 'POST', {
    currentPassword,
    newPassword,
  })
}

export const twoFactorAuthToggle = async (
  email: string,
  userId: string,
  twoFactorAuthentication: boolean
) => {
  return api(`${APIEndpoints.twoFactorAuthToggle}/${userId}`, 'PUT', {
    email,
    twoFactorAuthentication,
  })
}

export const getOneUser = async (
  userId: string,
  selectedId?: string | string[] | undefined
) => {
  return api(
    `${APIEndpoints.getOneUser}/${userId}?selectedId=${selectedId}`,
    'GET'
  )
}

export const getAllPostsOfUser = async (userId: string) => {
  return api(`${APIEndpoints.getAllPostsOfUser}?id=${userId}`, 'GET')
}

export const cancelFriendRequest = async (from: string, to: string) => {
  return api(`${APIEndpoints.cancelFriendRequest}`, 'PUT', { from, to })
}

export const acceptFriendRequest = async (
  acceptersId: string,
  reqMakersId: string
) => {
  return api(`${APIEndpoints.acceptFriendRequest}`, 'PUT', {
    acceptersId,
    reqMakersId,
  })
}

export const rejectFriendRequest = async (
  rejectorId: string,
  reqMakerId: string
) => {
  return api(`${APIEndpoints.rejectFriendRequest}`, 'PUT', {
    rejectorId,
    reqMakerId,
  })
}

export const deleteOnePost = async (userId: string, PostId: string) => {
  return api(`${APIEndpoints.deleteOnePost}/${userId}/${PostId}`, 'PUT')
}

export const addLike = async (
  userId: string,
  likeFrom: string,
  to: string,
  post_id: string
) => {
  return api(`${APIEndpoints.addLike}/${userId}`, 'PUT', {
    likeFrom,
    to,
    post_id,
  })
}

export const disLike = async (
  userId: string,
  dislikeFrom: string,
  to: string,
  post_id: string
) => {
  return api(`${APIEndpoints.disLike}/${userId}`, 'PUT', {
    dislikeFrom,
    to,
    post_id,
  })
}

export const updateProfilePhoto = async (userId: string, data: any) => {
  return api(`${APIEndpoints.updateProfilePhoto}/${userId}`, 'POST', data)
}

export const sendRequest = async (from: string, to: string) => {
  return api(`${APIEndpoints.sendRequest}`, 'PUT', { from, to })
}

export const unFriendUser = async (removedBy: string, to: string) => {
  return api(`${APIEndpoints.unfriendUser}`, 'PUT', { removedBy, to })
}

export const addComment = async (
  userId: string,
  from: string,
  to: string | string[] | undefined,
  post_id: string | string[] | undefined,
  description: string
) => {
  return api(`${APIEndpoints.addComment}/${userId}`, 'PUT', {
    from,
    to,
    post_id,
    description,
  })
}

export const deleteOneComment = async (
  userId: string,
  postBy: string | string[] | undefined,
  postId: string | string[] | undefined,
  commentId: string
) => {
  return api(`${APIEndpoints.deleteOneComment}/${userId}`, 'DELETE', {
    postBy,
    postId,
    commentId,
  })
}

export const addReplyToComment = async (
  userId: string,
  userName: string | string[] | undefined,
  from: string,
  to: string | string[] | undefined,
  post_id: string | string[] | undefined,
  comment_id: string,
  reply: string
) => {
  return api(`${APIEndpoints.addReplyToComment}/${userId}`, 'PUT', {
    userName,
    from,
    to,
    post_id,
    comment_id,
    reply,
  })
}

export const deleteCommentReply = async (
  userId: string,
  postBy: string | string[] | undefined,
  from: string,
  post_id: string | string[] | undefined,
  comment_id: string,
  commentReply_id: string
) => {
  return api(`${APIEndpoints.deleteCommentReply}/${userId}`, 'DELETE', {
    postBy,
    from,
    post_id,
    comment_id,
    commentReply_id,
  })
}

export const getAllRequests = async (userId: string) => {
  return api(`${APIEndpoints.getAllRequests}?id=${userId}`, 'GET')
}

export const getAllSuggetions = async (userId: string) => {
  return api(`${APIEndpoints.getAllSuggetions}?id=${userId}`, 'GET')
}

export const getAllComments = async (
  userId: string,
  id: string | string[] | undefined,
  postId: string | string[] | undefined
) => {
  return api(
    `${APIEndpoints.getAllComments}/${userId}?postBy=${id}&postId=${postId}`,
    'GET'
  )
}

export const getUserFriends = async (userId: string) => {
  return api(`${APIEndpoints.getUserFriends}?id=${userId}`, 'GET')
}

export const getFriendPosts = async (
  userId: string,
  skip: number,
  limit: string
) => {
  return api(
    `${APIEndpoints.getFriendPosts}?id=${userId}&skip=${skip}&limit=${limit}`,
    'GET'
  )
}

export const addPost = async (
  userId: string,
  postDescription: string,
  postImage: any,
  userName: string
) => {
  const data = new FormData()
  data.append('userName', userName)
  data.append('description', postDescription)
  data.append('imageURL', postImage)
  return api(`${APIEndpoints.addPost}/${userId}`, 'POST', data)
}

export const getAllConversations = async (userId: string) => {
  return api(`${APIEndpoints.getAllConversations}/${userId}`, 'GET')
}

export const getAllMessages = async (
  userId: string,
  conversationId: string
) => {
  return api(
    `${APIEndpoints.getAllMessages}/${userId}/${conversationId}`,
    'GET'
  )
}

export const sendMessage = async (
  userId: string,
  text: string,
  conversationId: string
) => {
  console.log(userId, text, conversationId)
  return api(`${APIEndpoints.sendMessage}/${userId}`, 'POST', {
    sender: userId,
    text,
    conversationId,
  })
}

export const newConversation = async (userId: string, receiverId: string) => {
  return api(`${APIEndpoints.newConversation}/${userId}`, 'POST', {
    senderId: userId,
    receiverId,
  })
}

export const deleteChatUser = async (
  userId: string,
  conversationId: string
) => {
  return api(
    `${APIEndpoints.deleteChatUser}/${userId}/${conversationId}`,
    'DELETE'
  )
}

export const deleteSingleMessage = async (
  userId: string,
  messageId: string
) => {
  console.log(userId, 'habsngdjhsa', messageId)
  return api(
    `${APIEndpoints.deleteSingleMessage}/${userId}/${messageId}`,
    'DELETE'
  )
}
