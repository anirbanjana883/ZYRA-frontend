import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setLoopData } from "../redux/loopSlice";

function getAllLoops() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoops = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/loop/getAll`, {
          withCredentials: true,
        });
        // Dispatch to Redux
        dispatch(setLoopData(response.data));
      } catch (error) {
        console.error("Error fetching loops:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoops();
  }, [dispatch]);

  return loading; 
}

export default getAllLoops;
