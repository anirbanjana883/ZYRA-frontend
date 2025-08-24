import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setUserData ,setFollowing} from '../redux/userSlice';
import { serverUrl } from '../App';
import { setStoryList } from '../redux/storySlice';

function getAllStories() {
  const dispatch = useDispatch();
  const {userData} = useSelector(state=>state.user)
  const {storyData} = useSelector(state=>state.story)
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/story/getAll`, {
          withCredentials: true,
        });
        dispatch(setStoryList(result.data));

      } catch (error) {
        console.error("Error fetching current user:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchStories();
  }, [dispatch]);

  return loading; 
};

export default getAllStories;
