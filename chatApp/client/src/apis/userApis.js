import axios from '../axiosConfig/axios'
import privateAxios from '../axiosConfig/private'

export const postCreate = (data) => axios.post('/create',data)

export const postLogin = (data) => axios.post('/login',data)

export const getUser = (id) => privateAxios.get(`/userDetails/${id}`)

export const setProfilePicture = (data) => privateAxios.post('/updateProfilePic',data)

export const postActiveStatus = (id)=> privateAxios.post('/update/active-status',{id:id})

export const findSearch = (data)=> privateAxios.get(`/search/${data}`)