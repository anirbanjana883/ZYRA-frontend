import React from "react";
import { useSelector } from "react-redux";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import dp from "../assets/dp.png";
import { MdAttachment } from "react-icons/md";
import { GrSend } from "react-icons/gr";


function MessageArea() {
  const { selectedUser } = useSelector((state) => state.message);
  const navigate = useNavigate();
  return (
    <div className="w-full h-[100vh] bg-black relative">
      {/* profile image , back icon  */}
      <div className="flex items-center gap-[15px] px-[20px] py-[10px] top-0 z-[100] bg-black w-full">
        {/* back icon */}
        <div className=" h-[80px]  flex items-center gap-[20px] px-[20px]">
          <IoArrowBack
            size={30}
            className="text-white cursor-pointer hover:text-gray-300 "
            onClick={() => navigate(`/`)}
          />
        </div>

        {/* pprofile image  */}
        <div>
          <div
            className="w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden"
            onClick={() => navigate(`/profile/${selectedUser.userName}`)}
          >
            <img
              src={selectedUser?.profileImage || dp}
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* name and user name  */}

        <div className="text-white text-[18px] font-semibold 
        ">
            <div>{selectedUser?.userName}</div>
            <div className="text-[14px] text-gray-300">{selectedUser?.name}</div>
        </div>


      </div>

      {/* form */}
      <div className="w-full h-[80px] fixed bottom-0 flex justify-center items-center bg-black z-[100]">
        <form className="w-[90%] max-w-[800px] h-[80%] rounded-full bg-[#131616]
        flex items-center gap-[10px] px-[20px] ">
          <input type="text" placeholder="Message" className="w-full h-full px-[20px] text-[18px] text-white outline-0"/>
          {/* icon */}
          <div><MdAttachment className="w-[28px] h-[28px] text-white"/></div>
          <button className="w-[60px] h-[40px] rounded-full bg-gradient-to-br from-[#9500ff]
          to-[#ff0095] flex items-center justify-center"><GrSend /></button>
        </form>
      </div>


    </div>
  );
}

export default MessageArea;
