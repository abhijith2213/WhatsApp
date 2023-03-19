import privateAxios from '../axiosConfig/private'

export const getUserChats = (userId) => privateAxios.get(`/chat/${userId}`)

export const getUserMessages =(chatId)=> privateAxios.get(`/message/${chatId}`)

export const postSendMessage = (message) => privateAxios.post('/message',message)

export const postSendImage = (data) => privateAxios.post('/message/image',data)

export const changeMessageStatus =(id)=> privateAxios.post(`/message/read/${id}`)

export const startNewChat =(id)=> privateAxios.post('/chat',id)

export const fetchUnreadApi = (id)=> privateAxios.get(`/message/unread/${id}`)