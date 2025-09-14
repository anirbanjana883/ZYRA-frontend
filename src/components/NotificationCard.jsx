import React, { useState } from "react";
import dp from "../assets/dp.png";
import { useDispatch } from "react-redux";
import { removeNotification } from "../redux/userSlice";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { serverUrl } from "../App";

function NotificationCard({ noti }) {
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(true);

  const markAsReadAndRemove = async () => {
    try {
      await axios.delete(`${serverUrl}/api/user/deleteNotification/${noti._id}`, {
        withCredentials: true,
      });
      dispatch(removeNotification(noti._id));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && noti && (
        <motion.div
          className={`w-full flex justify-between items-center p-3 sm:p-4 rounded-xl cursor-pointer transition
            ${noti.isRead ? "bg-gray-800" : "bg-gray-700 border border-blue-400"}`}
          initial={{ x: 0, opacity: 1 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -200, opacity: 0 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(e, info) => {
            if (Math.abs(info.offset.x) > 100) markAsReadAndRemove();
          }}
        >
          {/* Left: Profile image + text */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-gray-700">
              <img
                src={noti?.sender?.profileImage || dp}
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-semibold text-sm sm:text-base">
                @{noti?.sender?.userName || "Unknown"}
              </span>
              <span className="text-gray-300 text-xs sm:text-sm">
                {noti?.message || "No message"}
              </span>
              {noti?.createdAt && (
                <span className="text-gray-400 text-xs mt-1">
                  {new Date(noti.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </div>
          </div>

          {/* Right: Post/Loop preview */}
          {(noti?.post || noti?.loop) && (
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-gray-700">
              {(() => {
                const mediaItem = noti.post || noti.loop;
                if (!mediaItem?.media) return null;
                return mediaItem.mediaType === "image" ? (
                  <img
                    src={mediaItem.media}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={mediaItem.media}
                    muted
                    loop
                    className="w-full h-full object-cover"
                  />
                );
              })()}
            </div>
          )}
        </motion.div>
      )}

      {/* Default message if no notification */}
      {!noti && (
        <div className="flex flex-col items-center justify-start h-60 sm:h-60 mt-10 text-gray-400 gap-2">
          <p className="text-lg sm:text-xl font-semibold">No notifications yet</p>
          <p className="text-sm sm:text-base">All your notifications will appear here.</p>
        </div>
      )}
    </AnimatePresence>
  );
}

export default NotificationCard;
