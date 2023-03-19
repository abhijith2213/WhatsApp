import React, { useEffect, useState } from "react";
import { format } from "timeago.js";
import { MdInsertPhoto } from "react-icons/md";
import { fetchUnreadApi } from "../../apis/chatApis";
import { getUser } from "../../apis/userApis";
import { socket } from "../../context/SocketContext";
export default function Chat({
  chat,
  currentUser,
  online,
  typing,
  search,
  active,
}) {
  const [recieverData, setRecieverData] = useState(null);
  const [recieveMessage, setRecieveMessage] = useState(null);
  const [unread, setUnread] = useState(0);
  const PF = process.env.REACT_APP_IMAGE_URL;
  
  useEffect(() => {
    if (!search) {
      const recieverId = chat?.members?.find((id) => id != currentUser);
      getRecieverData(recieverId);
    } else {
      setRecieverData(chat);
    }
  }, []);

  //fetch unread message count
  useEffect(() => {
    if (active === chat._id) {
      setUnread(0);
    } else {
      fetchUnread();
    }
  }, [chat, active]);


  useEffect(() => {
    socket.on("recieve-message", (data) => {
      setRecieveMessage(data);
    });
    if (
      recieveMessage?.chatId !== active &&
      recieveMessage?.senderId === recieverData?._id
    ) {
      setUnread((unread) => unread + 1);
    }
    if(recieveMessage?.senderId === recieverData?._id ){
      chat.updatedAt = Date.now()
    }
  }, [socket, recieveMessage]);




  const fetchUnread = async () => {
    try {
      const { data } = await fetchUnreadApi(chat._id);
      setUnread(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getRecieverData = async (id) => {
    try {
      const { data } = await getUser(id);
      setRecieverData(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`flex justify-between items-center cursor-pointer w-100 h-[85px] px-3 hover:bg-[#202d33] `}
    >
      {/* Profile picture */}
      <div className="relative">
        <img
          src={PF + recieverData?.profile}
          alt="profile_picture"
          className="rounded-full w-[50px] h-[50px] mr-5"
        />
        {online ? (
          <span className="bg-green-700 w-3 h-3 rounded-full absolute right-3 top-0" />
        ) : (
          ""
        )}
      </div>
      {/* Info container */}
      <div className="flex justify-between border-t border-neutral-700 w-100 h-100 py-3">
        {/* Contact name and message */}
        <div className="flex flex-col justify-between text-white">
          {/* Contact name */}
          <h3 className="text-xl font-normal mb-1">{recieverData?.name}</h3>

          {/* Message */}
          {typing.includes(recieverData?._id) ? (
            <p className={`text-sm text-green-600`}>typing ...</p>
          ) : (
            <>
               {/* //recent msg can be add */}
            </>
          )}
        </div>

        {/* Time and number of messages*/}
        <div className="flex flex-col justify-between items-end h-100 text-xs">
          {/* Time */}
          <p className="text-emerald-500 min-w-[55px]">
            {!search && format(chat?.updatedAt)}
          </p>

          {/* Number of messages */}
          {unread ? (
            <div className="flex justify-center items-center bg-emerald-500 rounded-full w-[20px] h-[30px]">
              <p className="text-emerald-900 m-0">{unread}</p>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}
