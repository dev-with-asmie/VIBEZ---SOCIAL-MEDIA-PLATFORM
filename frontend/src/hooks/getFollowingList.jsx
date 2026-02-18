import { setFollowing, setUserData } from '../redux/userSlice'
import { setCurrentUserStory } from '../redux/storySlice'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import axios from 'axios'
import { serverUrl } from '../App'
function GetFollowingList () {
    const dispatch = useDispatch() 
    const {storyData} = useSelector(state=>state.story) 
   useEffect(()=>{
     const fetchUser = async ()=>{
        try {
            const result = await axios.get(`${serverUrl}/api/user/followingList`,{withCredentials:true})  
            dispatch(setFollowing(result.data))  
        } catch (error) {
            console.log(error)  
        }
     }
    fetchUser() 
   },[storyData]) 
}
export default GetFollowingList