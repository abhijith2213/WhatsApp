const mongoose = require('mongoose')

const ChatSchema = mongoose.Schema({
    members:{
        type: Array,
    },
    // recent:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:'message'
    // }
},{timestamps:true})

const ChatModel = mongoose.model("Chat", ChatSchema)
module.exports = ChatModel;