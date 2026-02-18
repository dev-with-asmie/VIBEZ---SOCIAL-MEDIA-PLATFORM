import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import { useDispatch, useSelector } from 'react-redux';
import GetCurrentUser from './hooks/getCurrentUser';
import GetSuggestedUser from './hooks/getSuggestedUser';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Upload from './pages/Upload';
import GetAllPost from './hooks/getAllPost';
import GetAllWaves from './hooks/getAllWaves';
import Waves from './pages/Waves';
import Story from './pages/Story';
import GetAllStories from './hooks/getAllStories';
import Messages from './pages/Messages';
import MessageArea from './pages/MessageArea';
import {io} from "socket.io-client"
import { setOnlineUsers, setSocket } from './redux/socketSlice';
import GetFollowingList from './hooks/getFollowingList';
import GetPrevChatUsers from './hooks/getPrevChatUsers';
import Search from './pages/Search';
import GetAllNotification from './hooks/getAllNotification';
//import Notification from '../../backend/models/notification.model';
import Notifications from './pages/Notifications';
import { setNotificationData } from './redux/userSlice';
//import { addMessage, updateChatPreview } from "./redux/messageSlice";




export const serverUrl = "https://vibez-backend-synb.onrender.com"

function App(){
  

  GetCurrentUser() 
  GetSuggestedUser() 
  GetAllPost() 
  GetAllWaves() 
  GetAllStories() 
  GetFollowingList() 
  GetPrevChatUsers() 
  GetAllNotification() 

  const {userData,notificationData} = useSelector(state=>state.user)
  
  const {socket} = useSelector(state=>state.socket)  
  const dispatch = useDispatch()  

  {/*useEffect(()=>{
    if(userData){
        const socketIo = io(serverUrl,{
          query:{
            userId: userData._id 
          }
        })
        dispatch(setSocket(socketIo)) 

        socketIo.on('getOnlineUsers',(users)=>{
          dispatch(setOnlineUsers(users))
        })
        return ()=>socketIo.close() 
    } else{
        if(socket){
          socket.close()
          dispatch(setSocket(null)) 
        }
    }
  },[userData]) 
  */}
  useEffect(() => {
  if (!userData?._id || socket) return;

  const socketIo = io(serverUrl, {
    query: {
      userId: userData._id,
    },
  });

  dispatch(setSocket(socketIo));

  socketIo.on("getOnlineUsers", (users) => {
    dispatch(setOnlineUsers(users));
  });

  return () => {
    socketIo.disconnect();
  };
}, [userData?._id]);


 

  
  
  return ( 
    <>
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path = '/signup' element = {!userData?<SignUp/>:<Navigate to={"/"}/>}/>
      <Route path = '/signin' element = {!userData?<SignIn/>:<Navigate to={"/"}/>}/> 
      <Route path = '/home' element = {userData?<Home/>:<Navigate to={"/signin"}/>}/>
      <Route path = '/forgot-password' element = {!userData?<ForgotPassword/>:<Navigate to={"/"}/>}/>
      <Route path = '/profile/:userName' element = {userData?<Profile/>:<Navigate to={"/signin"}/>}/>
      <Route path = '/story/:userName' element = {userData?<Story/>:<Navigate to={"/signin"}/>}/> 
      <Route path = '/upload' element = {userData?<Upload/>:<Navigate to={"/signin"}/>}/>
      <Route path = '/search' element = {userData?<Search/>:<Navigate to={"/signin"}/>}/>
      <Route path = '/editprofile' element = {userData?<EditProfile/>:<Navigate to={"/signin"}/>}/>
      <Route path = '/waves' element = {userData?<Waves/>:<Navigate to={"/signin"}/>}/>
      <Route path = '/messages' element = {userData?<Messages/>:<Navigate to={"/signin"}/>}/> 
      <Route path = '/messageArea' element = {userData?<MessageArea/>:<Navigate to={"/signin"}/>}/> 
      <Route path = '/notifications' element = {userData?<Notifications/>:<Navigate to={"/signin"}/>}/> 
    </Routes> 
    </> 
  )
}

export default App
