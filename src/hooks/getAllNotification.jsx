import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { io } from "socket.io-client";
import { serverUrl } from "../App";
import {
  setNotificationData,
  removeNotification,
  updateNotification,
  addNotification,
} from "../redux/userSlice";

let socket;

function getAllNotification() {
  const dispatch = useDispatch();
  const { userData, notificationData } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userData?._id) return;

    // Fetch all notifications once on mount
    const fetchNotification = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/user/getAllNotifications`,
          {
            withCredentials: true,
          }
        );
        dispatch(setNotificationData(result.data));
      } catch (error) {
        console.error("Error getting all notifications", error);
      }
    };
    fetchNotification();

    // ===== CHANGE START: Connect socket for real-time notifications =====
    socket = io(serverUrl, { query: { userId: userData._id } });

    // Listen for real-time notifications
    socket.on("newNotification", (notification) => {
      dispatch(addNotification(notification)); // prepend new notification
    });

    // Listen for offline notifications on first connect
    socket.on("receiveOfflineNotifications", (notifications) => {
      dispatch(setNotificationData(notifications));
    });
    // ===== CHANGE END =====

    return () => {
      if (socket) socket.disconnect();
    };
  }, [dispatch, userData?._id]);

  return socket;
}

export default getAllNotification;
