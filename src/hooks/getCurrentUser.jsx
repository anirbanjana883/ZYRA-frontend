import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setUserData, setFollowing } from '../redux/userSlice';
import { serverUrl } from '../App';
import { setCurrentUserStory } from '../redux/storySlice';

function getCurrentUser() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/current`, {
          withCredentials: true,
        });

        dispatch(setUserData(result.data));
        dispatch(setFollowing(result.data.following));

        // ✅ If user has a story, fetch full story details
        if (result.data.story) {
          const storyRes = await axios.get(
            `${serverUrl}/api/story/getByUserName/${result.data.userName}`,
            { withCredentials: true }
          );
          dispatch(setCurrentUserStory(storyRes.data));
        } else {
          dispatch(setCurrentUserStory(null));
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchUser();
  }, [dispatch]);

  return loading; 
}

export default getCurrentUser;
