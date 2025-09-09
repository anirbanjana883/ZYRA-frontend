import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import dayjs from "dayjs";

function SenderMessage({ message }) {
  const { userData } = useSelector((state) => state.user)
  const scroll = useRef()

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" })
  }, [message.message , message.image])

  return (
    <div
      ref={scroll}
      className='w-fit max-w-[60%] bg-gradient-to-r from-fuchsia-500 via-purple-600 to-indigo-600 rounded-t-2xl
      rounded-bl-2xl rounded-br-0 px-[12px] py-[10px] relative ml-auto right-0 flex flex-col gap-[10px] shadow-lg'>
      
      {message?.image && (
        <img 
          src={message.image} 
          alt="" 
          className='h-[200px] object-cover rounded-2xl shadow-md'
        />
      )}

      {message?.message && (
        <div className='text-[16px] text-white break-words leading-relaxed'>
          {message.message}
        </div>
      )}
      
      {/*  timestamp */}
      <div className="text-[11px] text-gray-200 ml-auto">
        {dayjs(message?.createdAt).format("h:mm A")}
      </div>
      
      {/* sender image */}
      <div className='w-[30px] h-[30px] rounded-full cursor-pointer overflow-hidden absolute right-[-25px] bottom-[-35px] ring-2 ring-white/30'>
        <img src={userData.profileImage} alt="" 
        className='w-full h-full object-cover'/>
      </div>
    </div>
  )
}

export default SenderMessage
