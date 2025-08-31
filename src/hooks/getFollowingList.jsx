import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setUserData ,setFollowing} from '../redux/userSlice';
import { serverUrl } from '../App';
import { setStoryList } from '../redux/storySlice';

function getFollowingList() {
  const dispatch = useDispatch();
  const {userData} = useSelector(state=>state.user)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/followingList`, {
          withCredentials: true,
        });
        dispatch(setFollowing(result.data));
      } catch (error) {
        console.error("Error fetching current user:", error);
      } 
    };

    fetchUser();
  }, [dispatch]);
};

export default getFollowingList;
;
