const ChatModel = require("../Models/chatSchema");

//Create new chat

const createChat = async (req, res) => {
  console.log(req.user, "reeeeeeeeeeeeeeeeeeeac");
  console.log(req.body, "new chat bodyyyyy");
  const newChat = new ChatModel({
    members: [req.user._id, req.body.id],
  });
  try {
    const chat = await ChatModel.findOne({
      members: { $all: [req.user._id, req.body.id] },
    });
    if (!chat) {
      const result = await newChat.save();
      res.status(200).json(result);
    } else {
      res.status(200).json(chat);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

//User chats

const userChats = async (req, res) => {
  try {
    const chat = await ChatModel.find({
      members: { $in: [req.params.userId] },
    }).sort({ updatedAt: -1 });
    // .populate('recent','senderId text image');
    console.log(chat, "findeddd chattttt");
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};

//Find user chats

const findChat = async (req, res) => {
  try {
    const chat = await ChatModel.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { findChat, userChats, createChat };
