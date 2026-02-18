import React, { useState } from 'react'
import dp from "../assets/empty-dp-image.jpg" 
import { FiPlusCircle } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';

function StoryDp ({profileImage,userName,story}) { 
    const navigate=useNavigate()  
    const { userData } = useSelector(state=>state.user) 
    
    const handleViewers = async () =>{
        try{
            const result = await axios.get(`${serverUrl}/api/story/view/${story._id}`,{withCredentials:true}) 


        } catch (error){
            console.log(error) 

        }
    }

    const handleClick=()=>{
        if(!story && userName == "Your Story"){
            navigate("/upload")  
        }  else if(story && userName =="Your Story"){
            handleViewers() 
            navigate(`/story/${userData.userName}`) 

        }
        else{
            handleViewers() 
            navigate(`/story/${userName}`) 

        }
    }

    return ( 
        <div className='flex flex-col w-[80px]' >   
         <div className={`w-[80px] h-[80px] ${story?"bg-gradient-to-r from-purple-800 to-red-600":""} rounded-full flex justify-center items-center relative`} onClick={handleClick}> 
                <div className='w-[70px] h-[70px] border-2 border-black rounded-full cursor-pointer overflow-hidden'> 
                                <img src={profileImage || dp} alt="" className='w-full object-cover'/> 
                                {!story && userName=="Your Story" && <div>
                                    <FiPlusCircle className='text-black absolute bottom-[9px] bg-white right-[9px] rounded-full w-[22px] h-[22px]'/>     
                                   
                                </div>} 
                                
                                
                            </div>
                            </div>

        {/*username*/}
        <div className='text-[14px] text-center truncate w-full text-white'>{userName}</div>
        </div>
    )
}
export default StoryDp 