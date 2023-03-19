import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Buttons from "../commonButton/Buttons";
import { MdPeopleAlt } from "react-icons/md";
import { TbCircleDashed } from "react-icons/tb";
import { BsFillChatLeftTextFill } from "react-icons/bs";
import { IoMdLogOut } from "react-icons/io";
import { BiFilter } from "react-icons/bi";
import Chat from "../chat/Chat";
import { UserContext } from "../../context/UserDetailsProvider";
import { socket } from "../../context/SocketContext";
import { changeMessageStatus, getUserChats, startNewChat } from "../../apis/chatApis";
import { findSearch } from "../../apis/userApis";

export default function AllChats({ setCurrentChat, setProfile,onlineUsers }) {
  const [filter, setFilter] = useState(false);
  const [chats, setChats] = useState([]);
  const [active,setActive] =useState('')
  const [typing, setTyping] = useState([]);
  const [searchUser, setSearchUser] = useState([]);
  const { user } = useContext(UserContext);
  const PF = process.env.REACT_APP_IMAGE_URL;
  const navigate = useNavigate();
  //fetch user chats
  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    socket.on("user-typing", (data) => {
      console.log("user is typing");
      if(!typing?.some((user)=> user === data))
      {
          setTyping([...typing,data])
      }
    });

    socket.on("user-stopped-typing", (data) => {
      console.log("user stop  typing");
      const result = typing.filter((user) => user !== data)
      setTyping(result);
    });
  }, []);

  //fetch userChats
  const fetchChats = async () => {
    try {
      const { data } = await getUserChats(user?._id);
      console.log(data);
      setChats(data);
    } catch (error) {
      console.log(error);
    }
  };

  //Checking user online or not

  const checkOnlineStatus = (chat) => {
    if(chat.members){
      console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzz');
      const chatMember = chat.members.find((member) => member !== user?._id);
      const online = onlineUsers.find((user) => user.userId === chatMember);
      return online ? true : false;
    }else{
      const online = onlineUsers.find((user) => user.userId === chat);
      return online ? true : false;
    }
  };

  //search user
  const handleChange = async (e) => {
    const val = e.target.value;
    if (val == "") {
      setSearchUser([]);
    } else {
      try {
        const { data } = await findSearch(val);
        setSearchUser(data.users);
      } catch (error) {
        console.log(error);
      }
    }
  };


  //Handle new chat
  const handleNewChat =async(id)=>{
    try {
      const {data} = await startNewChat({id:id})
      setCurrentChat(data);
      return data
    } catch (error) {
      console.log(error);
    }
  }

  //handle chat click
  const handleChatClick=(chat)=>{
    socket.emit('chat-open',{chat:chat,user:user._id})
    setCurrentChat(chat);
    changeMessageStatus(chat._id);
    setActive(chat._id)
  }

  //LOGUT
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.clear();
    socket.emit('logout')
    navigate("/login");
  };

  return (
    <div className="flex flex-col border-r border-neutral-700 w-100 h-screen">
      <div className="flex justify-between items-center bg-[#202d33] h-[60px] p-3">
        {/* Profile picture */}
        <img
          src={PF + user?.profile}
          alt="profile_picture"
          className="rounded-full w-[40px] h-[40px] cursor-pointer"
          onClick={() => setProfile(true)}
        />

        <div className="flex justify-between w-[175px]">
          <Buttons icon={<MdPeopleAlt />} />
          <Buttons icon={<TbCircleDashed />} />
          <Buttons icon={<BsFillChatLeftTextFill />} />
          <Buttons icon={<IoMdLogOut onClick={handleLogout} />} />
        </div>
      </div>

      <div className="flex justify-between items-center h-[60px] p-2">
        {/* Search input */}
        <input
          type="search"
          name="search"
          onChange={handleChange}
          placeholder="Search or start a new chat"
          className="rounded-lg bg-[#202d33] text-[#8796a1] text-sm font-light outline-none px-4 py-2 w-[400px] h-[35px] placeholder:text-[#8796a1] placeholder:text-sm placeholder:font-light"
        />

        <button
          className={`text-2xl m-2 p-1 rounded-full ${
            filter
              ? "bg-emerald-500 text-white rounded-full hover:bg-emerald-700"
              : "text-[#8796a1] hover:bg-[#3c454c]"
          }`}
          onClick={() => setFilter(!filter)}
        >
          <BiFilter />
        </button>
      </div>
      {/* Search */}
      {searchUser.length !== 0 ? <div className="flex flex-col overflow-y-scroll cursor-pointer h-28 max-h-52">
          {searchUser?.map((usr,i)=>{
             return (
              <div
                key={i}
                onClick={() => {
                handleNewChat(usr._id)
                }}>
                <Chat
                  chat={usr}
                  currentUser={user._id}
                  online={checkOnlineStatus(usr._id)}
                  typing={typing}
                  search={true}
                />
              </div>
            );
          })

          }
        </div>:''}

      {/* Chats */}
        <div className="flex flex-col overflow-y-scroll cursor-pointer h-100">
          {chats.length !== 0 ?chats.map((chat, i) => {
            return (
              <div
                key={i}
                onClick={() => {
                  handleChatClick(chat)
                }}
              >
                <Chat
                  chat={chat}
                  currentUser={user._id}
                  online={checkOnlineStatus(chat)}
                  typing={typing}
                  active={active}
                />
              </div>
            );
          }) :
          <div className="flex flex-col items-center justify-center mb-10 h-full"> 
          <p className="text-gray-300 text-lg">You have no chat's</p>
          <p className="text-gray-300">Start New Chat</p>
          </div>}
        </div>
       
    </div>
  );
}
