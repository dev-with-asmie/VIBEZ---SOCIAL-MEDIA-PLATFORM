import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setPostData } from '../redux/postSlice'
import { setNotificationData } from '../redux/userSlice'
function GetAllNotification () {
    const dispatch = useDispatch() 
    const {userData} = useSelector(state=>state.user)

     const fetchNotification = async ()=>{
        try {
            const result = await axios.get(`${serverUrl}/api/user/getAllNotifications`,{withCredentials:true}) 
            dispatch(setNotificationData(result.data)) 
        } catch (error) {
            console.log(error) 
        }
    } 
    fetchNotification() 

   
}
export default GetAllNotification 