import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setPostData } from '../redux/postSlice'
import { setWaveData } from '../redux/waveSlice'
function GetAllWaves () {
    const dispatch = useDispatch() 
    const {userData} = useSelector(state=>state.user)
   useEffect(()=>{
     const fetchwaves = async ()=>{
        try {
            const result = await axios.get(`${serverUrl}/api/wave/getAll`,{withCredentials:true}) 
            dispatch(setWaveData(result.data)) 
        } catch (error) {
            console.log(error) 
        }
     }
    fetchwaves() 
   },[dispatch,userData])  
}
export default GetAllWaves