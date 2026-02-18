import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setSelectedUser } from '../redux/messageSlice'
import dp from "../assets/empty-dp-image.jpg"  

function OnlineUser({user}) {
    const navigate = useNavigate() 
    const dispatch = useDispatch() 
  return (
    <div className='w-[60px] h-[60px] flex gap-[20px] justify-start items-center relative'> 
            <div className='w-[60px] h-[60px] border-2 border-black rounded-full cursor-pointer overflow-hidden' onClick={()=>{
                dispatch(setSelectedUser(user))
                navigate(`/messageArea`) 

            }}>
                               <img src={user.profileImage || dp} alt="" className='w-full object-cover'/>
            </div>

            <div className='w-[10px] h-[10px] bg-green-500 rounded-full absolute top-2 right-0'>
                

            </div>

    </div>
  )
}

export default OnlineUser
