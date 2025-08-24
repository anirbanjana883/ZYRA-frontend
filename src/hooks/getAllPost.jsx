import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setPostData } from "../redux/postSlice";

function getAllPost() {
  const dispatch = useDispatch();
  const {userData} = useSelector(state => state.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/post/getAll`, {
          withCredentials: true,
        });
        dispatch(setPostData(result.data));
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [dispatch , userData]);

  return loading; 
}

export default getAllPost;
