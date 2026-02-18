import { setFollowing, setUserData } from '../redux/userSlice'
import { setCurrentUserStory } from '../redux/storySlice'
import { useDispatch, useSelector } from 'react-redux'
import { setPrevChatUsers } from '../redux/messageSlice'
import { useEffect } from 'react'
import axios from 'axios'
import { serverUrl } from '../App'
function GetPrevChatUsers () {
    const dispatch = useDispatch() 
    const {messages} = useSelector(state=>state.message) 
   useEffect(()=>{
     const fetchUser = async ()=>{
        try {
            const result = await axios.get(`${serverUrl}/api/message/prevChats`,{withCredentials:true}) 
            dispatch(setPrevChatUsers(result.data))   
            
        } catch (error) {
            console.log(error)  
        } 
     }
    fetchUser() 
   },[messages]) 
}
export default GetPrevChatUsers