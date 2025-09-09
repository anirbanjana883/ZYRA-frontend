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
      className='w-fit max-w-[60%] bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-t-2xl
      rounded-br-2xl rounded-bl-0 px-[12px] py-[10px] relative left-0 flex flex-col gap-[10px] shadow-lg'>
      
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
      <div className="text-[11px] text-gray-100 ml-auto">
        {dayjs(message?.createdAt).format("h:mm A")}
      </div>

      {/* Receiver profile image */}
      <div className='w-[30px] h-[30px] rounded-full cursor-pointer overflow-hidden absolute left-[-25px] bottom-[-35px] ring-2 ring-white/30'>
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
