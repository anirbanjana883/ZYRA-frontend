import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setSuggestedUserData } from '../redux/userSlice'; 
import { serverUrl } from '../App';

function useSuggestedUsers() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/suggested`, {
          withCredentials: true,
        });
        dispatch(setSuggestedUserData(result.data));  
      } catch (error) {
        console.error("Error fetching suggested users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestedUsers();
  }, []); 

  return loading;
}

export default useSuggestedUsers;
