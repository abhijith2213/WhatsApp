import React, { useContext, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AllChats from "../components/allChats/AllChats";
import ChatDetails from "../components/chatDetail/ChatDetails";
import { UserContext } from "../context/UserDetailsProvider";
import noConversation from "../assets/images/noConversation.png";
import { socket } from "../context/SocketContext";
import Profile from "../components/profile/Profile";

export default function ChatInterface() {
  const [currentChat, setCurrentChat] = useState(null);
  const [recieveMessage, setRecieveMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [profile, setProfile] = useState(false);
  const { user } = useContext(UserContext);

    //Socket io new users
    useEffect(() => {
      socket.emit("new-user-add", user?._id);
      socket.on("get-users", (users) => {
        setOnlineUsers(users);
      });
    }, [user]);

  // Recieve message from socket server
  useEffect(() => {
    socket.on("recieve-message", (data) => {
      setRecieveMessage(data);
    });
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden">
      <div className="flex justify-start whatsapp-bp:justify-center items-center bg-[#111a21] h-screen">
        <div className="bg-[#111a21] min-w-[340px] max-w-[500px] w-100 h-100">
          {/* //all chats */}
          {profile ? (
            <Profile setProfile={setProfile} />
          ) : (
            <AllChats
              setCurrentChat={setCurrentChat}
              setProfile={setProfile}
              onlineUsers={onlineUsers}
            />
          )}
        </div>
        <div className="bg-[#222f35] min-w-[415px] max-w-[1120px] w-100 h-100">
          {/* //chat details */}
          {currentChat !== null ? (
            <ChatDetails
              chat={currentChat}
              currentUser={user._id}
              recieveMessage={recieveMessage}
              onlineUsers={onlineUsers}
            />
          ) : (
            <>
              <div className="w-full h-full flex justify-center items-center">
                <div>
                  <h2 className="dark:text-white text-center mb-4 font-medium">
                    WhatsApp Web
                  </h2>
                  <img src={noConversation}></img>
                  <p className="dark:text-white text-center">
                    Tap on chat to start conversation
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
