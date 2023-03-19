const express = require("express");
const upload = require("../Config/multerConfig");
const router = express.Router()
const { createController, loginController, getRefreshToken, getUserDetails, updateOnlineStatus,postUpdateProfilePic, searchUser } = require("../Controller/userController");
const verifyApi = require("../middlewares/verifyJwt");

router.post('/create',createController)

router.post('/login',loginController)

router.post('/refresh',getRefreshToken)

router.get('/userDetails/:id',verifyApi,getUserDetails)

router.post('/updateProfilePic',verifyApi, upload.single('file'),postUpdateProfilePic)

router.get('/search/:id',verifyApi,searchUser)

router.post('user-disconnect',updateOnlineStatus)


module.exports = router