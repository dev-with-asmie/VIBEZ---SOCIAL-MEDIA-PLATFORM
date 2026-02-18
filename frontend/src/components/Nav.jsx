import React from 'react'
import { GoHomeFill } from "react-icons/go";
import { FiSearch } from "react-icons/fi";
import { SiDwavesystems } from "react-icons/si";
import { FiPlusSquare } from "react-icons/fi";
import dp from "../assets/empty-dp-image.jpg" 
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Nav() {
    const navigate = useNavigate() 
    const {userData} =useSelector(state=>state.user)  
    return (
        <div className='w-[90%] lg:w-[40%] h-[60px] bg-gradient-to-r bg-gradient-to-r from-[#861aec] via-[#FF1493] via-[#FF4500] via-[#FFD700] to-[#00FF7F]
        flex justify-around items-center fixed bottom-[20px] rounded-full shadow-2xl shadow-[#000000] z-[100]'>
            <div onClick={()=>navigate("/")}><GoHomeFill className='w-[25px] h-[25px] cursor-pointer'/></div>
            <div onClick={()=>navigate("/search")}><FiSearch className='w-[25px] h-[25px] cursor-pointer'/></div>
            <div onClick={()=>navigate("/upload")}><FiPlusSquare className='w-[25px] h-[25px] cursor-pointer' /></div> 
            <div onClick={()=>navigate("/waves")}><SiDwavesystems className='w-[25px] h-[25px] cursor-pointer'/></div> 
        
            
            <div className='w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden' onClick={()=>navigate(`/profile/${userData.userName}`)}>  
                            <img src={userData.profileImage|| dp} alt="" className='w-full object-cover'/> 
            </div> 

        </div>
    )
}
export default Nav 