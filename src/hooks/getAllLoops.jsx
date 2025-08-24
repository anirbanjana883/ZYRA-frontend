import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setLoopData } from "../redux/loopSlice";

function getAllLoops() {
  const dispatch = useDispatch();
  const {userData} = useSelector(state => state.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchloops = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/loop/getAll`, {
          withCredentials: true,
        });
        dispatch(setLoopData(result.data));
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchloops();
  }, [dispatch ]);

  return loading; 
}

export default getAllLoops;
