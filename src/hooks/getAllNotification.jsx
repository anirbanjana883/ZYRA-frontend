import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setNotificationData } from "../redux/userSlice";

function getAllNotifications() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/user/getAllNotifications`,
          { withCredentials: true }
        );
        console.log("Fetched notifications:", result.data);
        dispatch(setNotificationData(result.data));
      } catch (error) {
        console.error("Error getting all notifications", error);
      }
    };

    if (userData?._id) {
      fetchNotification();
    }
  }, [dispatch, userData]);
}

export default getAllNotifications;
