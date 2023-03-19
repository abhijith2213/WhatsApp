const express = require('express')
const router = express.Router()
const { createChat, userChats, findChat } = require('../Controller/chatController')
const verifyApi = require('../middlewares/verifyJwt')



router.post('/',verifyApi, createChat)

router.get('/:userId',verifyApi,userChats)

router.get('/find/:firstId/:secondId',verifyApi,findChat)


module.exports = router