import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import dayjs from "dayjs";

function ReceiverMessage({ message }) {
  const { selectedUser } = useSelector((state) => state.message)
  const scroll = useRef()

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" })
  }, [message.message, message.image])

  return (
    <div
      ref={scroll}
      className='w-fit max-w-[60%] bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-500
        rounded-t-2xl rounded-br-2xl rounded-bl-0 px-4 py-3 relative left-0 flex flex-col gap-2
        shadow-[0_0_20px_rgba(0,255,255,0.5)] hover:scale-[1.02] transition-transform duration-200 mb-10'>

      {message?.image && (
        <img 
          src={message.image} 
          alt="" 
          className='h-[200px] object-cover rounded-2xl shadow-md'
        />
      )}

      {message?.message && (
        <div className='text-white text-[16px] font-medium break-words leading-relaxed drop-shadow-md'>
          {message.message}
        </div>
      )}

      {/* Timestamp */}
      <div className="text-[11px] text-gray-100 ml-auto">
        {dayjs(message?.createdAt).format("h:mm A")}
      </div>

      {/* Receiver profile image */}
      <div className='w-[30px] h-[30px] rounded-full cursor-pointer overflow-hidden absolute left-[-25px] bottom-[-35px] ring-2 ring-cyan-400/50'>
        <img 
          src={selectedUser?.profileImage} 
          alt="receiver" 
          className='w-full h-full object-cover'
        />
      </div>
    </div>
  )
}

export default ReceiverMessage
