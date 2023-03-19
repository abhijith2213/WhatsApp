import React, { useEffect, useRef, useState } from "react";
import InputEmoji from "react-input-emoji";
import { MdSearch, MdSend } from "react-icons/md";
import { HiDotsVertical } from "react-icons/hi";
import { AiOutlinePaperClip } from "react-icons/ai";
import Buttons from "../commonButton/Buttons";
import Message from "../message/Message";
import { getUser } from "../../apis/userApis";
import { changeMessageStatus, getUserMessages, postSendImage, postSendMessage } from "../../apis/chatApis";
import { socket } from "../../context/SocketContext";
import FileShareModal from "../modals/FileShareModal";

export default function ChatDetails({
  chat,
  currentUser,
  recieveMessage,
  onlineUsers,
}) {
  const [typing, setTyping] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [image,setImage] = useState('')
  const [showImage, setShowImage] = useState('')
  const [online, setOnline] = useState(false)
  const [messages, setMessages] = useState([]);
  const [recieverData, setRecieverData] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [modal, setModal] = useState(false)
  const PF = process.env.REACT_APP_IMAGE_URL;
  const recieverId = chat?.members.find((id) => id !== currentUser);

  // fetching reciever Data
  useEffect(() => {
    if (chat !== null) getRecieverData(recieverId);
    const online = onlineUsers.find((user) => user.userId === recieverId);
    if(online) setOnline(true)
    else setOnline(false)
  }, [chat, currentUser,onlineUsers]);

  const getRecieverData = async (id) => {
    try {
      const { data } = await getUser(id);
      setRecieverData(data);
    } catch (error) {
      console.log(error);
    }
  };

  //Fetching messages
  useEffect(() => {
    if (chat !== null) fetchMessages();
    socket.on('change-messageStatus',()=>{
      fetchMessages()
    })
  }, [chat]);

  //send message to socket server
  useEffect(() => {
    if (sendMessage !== null) {
      socket.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  //recieve message from socket
  useEffect(() => {
    if (recieveMessage !== null && recieveMessage.chatId === chat._id) {
      recieveMessage.read = true
      socket.emit('message-read',recieveMessage)
      setMessageStatus()
      setMessages([...messages, recieveMessage]);
    }
    socket.on("user-typing", (data) => {
      console.log("user is typing")
        if(!typing.some((user)=> user === data))
        {
          setTyping([...typing,data])
        }
    });

    socket.on("user-stopped-typing", (data) => {
      console.log("user stop  typing");
      const result = typing.filter((user) => user !== data)
      setTyping(result);
    });
  }, [recieveMessage]);

  //Change message Status
  const setMessageStatus =async()=>{
    try {
       await changeMessageStatus(chat._id)
    } catch (error) {
      console.log(error);
    }

  }

  //Fetch Messages

  const fetchMessages = async () => {
    try {
      const { data } = await getUserMessages(chat._id);
      console.log(data, "messages");
      setMessages(data);
    } catch (error) {
      console.log(error);
    }
  };

  let timer
  const handleChange = (newMessage) => {
    clearTimeout(timer)
     timer = setTimeout(()=>{
      console.log('caalleedddd timeouttttt');
      socket.emit("stop-typing", {recieverId:recieverId,senderId:currentUser});
    },1000)
    if (newMessage !== "") {
      socket.emit("typing", {recieverId:recieverId,senderId:currentUser});
      console.log('typingggg............');
      setNewMessage(newMessage);
    }
  };

  const handleSend = async (e) => {
    console.log("handle send also callled");
    e.preventDefault();
    if (newMessage) {
      const message = {
        senderId: currentUser,
        chatId: chat._id,
        text: newMessage,
      };
      try {
        const { data } = await postSendMessage(message);
        setMessages([...messages, data]);
        setNewMessage("");
      } catch (error) {
        console.log(error);
      }
      socket.emit("stop-typing", {recieverId:recieverId,senderId:currentUser});
      setSendMessage({ ...message, recieverId ,read:false});
    }
  };

  //Handle image field

  const handleImage =(e)=>{
    setShowImage(URL.createObjectURL(e.target.files[0]));
    setImage(e.target.files[0]);
    setModal(true);
  }

  //send iMage message
  const handleImageSend =async()=>{
    let datas;
    if(image){
      datas = new FormData();
      datas.append("file", image);
      datas.append('senderId',currentUser)
      datas.append('chatId',chat._id)
      let messageData
    try {
      const {data} = await postSendImage(datas)
      setMessages([...messages, data]);
      const { _id, createdAt, updatedAt, ...message } = data;
      messageData = message
      setImage('')
      setModal(false)
    } catch (error) {
      console.log(error);
      if(error?.response?.data === 'Only support jpg, jpeg, png, webp file Types'){
        alert(error?.response?.data)
      }
    }

    setSendMessage({...messageData, recieverId});
  }
  }

  return (
   <>
    <div className="flex flex-col h-screen">
      <div className="flex justify-between bg-[#202d33] h-[60px] p-3">
        <div className="flex items-center">
          <img
            src={PF + recieverData?.profile}
            alt="profile_picture"
            className="rounded-full w-[45px] h-[45px] mr-5"
          />

          <div className="flex flex-col mt-3">
            <h1 className="text-white text-xl font-normal mb-0">
              {recieverData?.name}
            </h1>

            {typing.includes(recieverData?._id) ? (
              <p className="text-[#8796a1] text-xs mt-0">typing ...</p>
            ) : (
              <p className="text-[#8796a1] text-xs mt-0">
                {online ? "online" : "offline"}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center w-[85px]">
          <Buttons icon={<MdSearch />} />
          <Buttons icon={<HiDotsVertical />} />
        </div>
      </div>

      <div
        className="bg-[#0a131a] bg-[url('assets/images/bg.webp')] bg-contain overflow-y-scroll h-100"
        style={{ padding: "12px 7%" }}
      >
        {messages.map((message, i) => (
          <Message key={i} message={message} currentUser={currentUser} />
        ))}
      </div>

      {/* Bottom section */}
      <div className="flex items-center bg-[#202d33] w-100 h-[70px] p-2">
        <span className="mr-2">
          <label
            htmlFor="image-input"
            className="text-[#8796a1] text-xl p-2  rounded-full hover:bg-[#3c454c] cursor-pointer"
          >
            <AiOutlinePaperClip className="" />
          </label>
          <input
            type="file"
            name="image"
            id="image-input"
            accept="image/*"
            onChange={handleImage}
            hidden
          />
        </span>

        {/* Input bar */}
        <InputEmoji
          value={newMessage}
          onChange={handleChange}
          cleanOnEnter
          onEnter={()=>handleSend}
          placeholder="Type a message"
        />
        {/* Send btn */}
        <span className="ml-2">
          <Buttons icon={<MdSend />} onClick={handleSend} />
        </span>
      </div>
    </div>
    {modal ? (
        <FileShareModal
          setModal={setModal}
          showImage={showImage}
          setImage={setImage}
          handleImageSend={handleImageSend}
        />
      ) : (
        ""
      )}
      </>
  );
}
