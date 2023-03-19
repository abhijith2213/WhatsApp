const express = require("express");
const multer = require("multer");
const upload = require("../Config/multerConfig.js");
const {
  addMessage,
  getMessages,
  addImageMessage,
  postMessageStatus,
  getUnread,
} = require("../Controller/messageController.js");
const verifyApi = require("../middlewares/verifyJwt.js");
const router = express.Router();

router.post("/", verifyApi, addMessage);

router.get("/:chatId", verifyApi, getMessages);

router.post("/image", verifyApi, upload.single("file"), addImageMessage);


router.post('/read/:id',verifyApi,postMessageStatus)

router.get('/unread/:id',verifyApi,getUnread)




module.exports = router;
