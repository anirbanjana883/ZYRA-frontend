
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import Home from './pages/Home';

import getCurrentUser from './hooks/getCurrentUser';
import getSuggestedUser from './hooks/getSuggestedUser';
import EditProfile from './pages/EditProfile';
import Upload from './pages/Upload';
import getAllPost from './hooks/getAllPost';
import Loops from './pages/Loops';
import getAllLoops from './hooks/getAllLoops';
import getAllStories from './hooks/getAllStories'
import Story from './pages/Story';
import Messages from './pages/Messages';
import MessageArea from './pages/MessageArea';
import { useEffect } from 'react';
import {io} from "socket.io-client"
import { setOnlineUsers, setSocket } from './redux/socketSlice';
import getFollowingList from './hooks/getFollowingList';
import getPrevChatUsers from './hooks/getPrevChatUsers';
import Search from './pages/Search';



export const serverUrl = "http://localhost:8000";

function App() {
  const dispatch = useDispatch()
  const loadingCurrent = getCurrentUser();
  const loadingSuggested = getSuggestedUser();
  const loadingPosts = getAllPost();
  const loadingLoop = getAllLoops();
  const loadingStory = getAllStories();
  const loadingFollowing = getFollowingList();
  const loadingPrevChat = getPrevChatUsers();
  const { userData } = useSelector((state) => state.user);
  const { socket } = useSelector((state) => state.socket);
  
useEffect(() => {
  if (userData) {
    const socketIo = io(serverUrl, {
      query: { 
        userId: userData._id 
      }
    });

    socketIo.on("connect", () => {
      console.log("Socket connected:", socketIo.id);
    });

    socketIo.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    dispatch(setSocket(socketIo));

    // will get user id of all the current user 
    socketIo.on('getOnlineUsers',(users)=>{
      dispatch(setOnlineUsers(users))
    })

    return () => socketIo.close();
  } else {
    if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }
}, [userData, dispatch]);


  if (loadingCurrent || loadingSuggested || loadingPosts || loadingLoop || loadingStory || loadingFollowing || loadingPrevChat) return null;

  return (
    <Routes>
      <Route path="/signup" element={!userData ? <SignUp /> : <Navigate to="/" />} />
      <Route path="/signin" element={!userData ? <SignIn /> : <Navigate to="/" />} />
      <Route path="/" element={userData ? <Home /> : <Navigate to="/signin" />} />
      <Route path="/forgot-password" element={!userData ? <ForgotPassword /> : <Navigate to="/" />} />
      <Route path="/profile/:userName" element={userData ? <Profile/> : <Navigate to="/signin" />} />
      <Route path="/editprofile" element={userData ? <EditProfile/> : <Navigate to="/signin" />} />
      <Route path="/upload" element={userData ? <Upload/> : <Navigate to="/signin" />} />
      <Route path="/loops" element={userData ? <Loops/> : <Navigate to="/signin" />} />
      <Route path="/messages" element={userData ? <Messages/> : <Navigate to="/signin" />} />
      <Route path="/story/:userName" element={userData ? <Story/> : <Navigate to="/signin" />} />
      <Route path="/messageArea" element={userData ? <MessageArea/> : <Navigate to="/signin" />} />
      <Route path="/search" element={userData ? <Search/> : <Navigate to="/signin" />} />
      
    </Routes>
  );
}

export default App;
