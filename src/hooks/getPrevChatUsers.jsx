import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setPrevChatUsers } from "../redux/messageSlice";

function usePrevChatUsers() {
  const dispatch = useDispatch();
  const {messages} = useSelector(state=>state.message)

  useEffect(() => {
    const fetchPrevChats = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/message/prevChats`, {
          withCredentials: true,
        });
        dispatch(setPrevChatUsers(result.data));
      } catch (error) {
        console.error("Error fetching previous chats:", error);
      }
    };

    fetchPrevChats();
  }, [messages]);
}

export default usePrevChatUsers;
