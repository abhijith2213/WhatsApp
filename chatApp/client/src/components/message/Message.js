import React, { useEffect, useRef } from 'react'
import {format} from 'timeago.js'
import {BsCheck2All, BsCheck2} from 'react-icons/bs'

export default function Message({ message, currentUser }) {
  const PF = process.env.REACT_APP_IMAGE_URL;


  const scroll = useRef()
   useEffect(()=>{
    scroll.current?.scrollIntoView({behavior:'smooth'})
   },[message])
  return (
    <div ref={scroll}
    className={`flex justify-center items-center rounded-md w-fit my-1 ${
      message.senderId === currentUser ? "bg-[#005c4b] ml-auto" : "bg-[#202d33] mr-auto"
    }`}
  >
    {/* Image message */}
    {message?.image ? (
      <div className="relative w-100 p-2">
        {/* Image */}
        <img
          src={PF +message?.image}
          alt="img_message"
          className="rounded-md max-w-[270px] w-100"
        />
        {/* Time */}
        <div
        className="flex justify-end  items-end max-w-[410px] p-2 absolute right-2 bottom-3 min-w-[50px]"
        style={{ wordBreak: "break-word" }}
      >
        <p className=" text-[#8796a1] text-[12px] mb-0 ">
          {format(message?.createdAt)}
        </p>
        { message?.read ? <BsCheck2All className='text-gray-400 ml-2 '/>
        :<BsCheck2 className='text-gray-400 ml-2'/>}
        </div>
      </div>
    ) : (
      // Text message
      <div
        className="flex justify-between items-end max-w-[410px] p-2"
        style={{ wordBreak: "break-word" }}
      >
          <p className="text-white text-sm mr-2">{message?.text}</p>
        <p className="text-[#8796a1] text-[12px] min-w-[50px] mb-0">{format(message?.createdAt)}</p>
        { message?.read ? <BsCheck2All className='text-gray-400 ml-2'/>
        :<BsCheck2 className='text-gray-400 ml-2'/>}
      </div>
    )}
  </div>
  )
}
