const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    chatId:{
        type:String
    },
    senderId: {
        type: String
    },
    text :{
        type: String
    },
    image: {
        type: String
    },
    read: {
        type: Boolean,
        default:false
    }
},{timestamps: true})

const MessageSchema = mongoose.model("message",messageSchema)
module.exports = MessageSchema;