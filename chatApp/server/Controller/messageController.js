const MessageSchema = require('../Models/messageSchema')
const ChatModel = require("../Models/chatSchema");


//Add new message

const addMessage = async(req,res)=>{
    console.log(req.body,'bodyyyyyyy');
    const {chatId,senderId,text} = req.body
    const message = new MessageSchema({
        chatId,
        senderId,
        text    
    })
    try {
        const result = await message.save()
        await ChatModel.updateOne({_id:chatId},{updatedAt:Date.now()})
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
}

//Get User Messages

const getMessages = async (req,res)=>{
    const {chatId} = req.params;

    try {
        const result = await MessageSchema.find({chatId})
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
}

//Send Image message

const addImageMessage = async(req,res,next)=>{
    console.log(req?.body,'image body');
    console.log(req?.file.filename,'image file');
    console.log(req.fileUploadError,'iplo');
    try{
        if(req.fileUploadError){
            console.log('error here');
        }
    

    const {chatId,senderId} = req?.body
    const image = req?.file?.filename
    const message = new MessageSchema({
        chatId,
        senderId,
        image    
    })
   
        const result = await message.save()
        await ChatModel.updateOne({_id:chatId},{updatedAt:Date.now(),recent:result._id})
        console.log(result);
        res.status(200).json(result)
    } catch (error) {
        console.log(error,'i am here');
        // next(error)
        res.status(500).json(error)
    }
}

//Get Unread Message Count

const getUnread = async(req,res) =>{
    const {id} = req.params
    const {_id} = req.user
    try {
        const data =await MessageSchema.find({chatId:id,read:false,senderId:{$ne:{_id}}})
        console.log(data);
        console.log(data?.length);
        res.status(200).json(data.length)
    } catch (error) {
        res.status(500).json(error.message)
    }
}

//Change message read/unread Status

const postMessageStatus =async(req,res)=>{
    console.log(req.params.id,'chat iddddd');
    console.log(req.user,'uuuuuuuuuuuuuuuuuuuuuuuuuu');
    const {id} = req.params
    try {
        const result =await MessageSchema.updateMany({chatId:id,senderId:{$ne:req?.user?._id},read:false},{$set:{read:true}})
        console.log(result,'updateeeeeeeeeee');
        res.status(200).json({message:'message read'})
    } catch (error) {
        
    }
}

module.exports={addMessage,getMessages,addImageMessage,postMessageStatus,getUnread}