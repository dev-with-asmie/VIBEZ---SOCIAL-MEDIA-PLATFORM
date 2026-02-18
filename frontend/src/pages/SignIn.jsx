import React, { useState } from 'react';
import logo from '../assets/VIBEZ-LOGO.png' 
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5"; 
import axios from 'axios';
import { serverUrl } from '../App'
import { ClipLoader } from "react-spinners";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function SignIn(){
  const [inputClicked, setInputClicked] = useState({
  
    userName: false,
    password: false 
  });

  const [showPassword, setShowPassword] = useState(false) 
  const [loading, setLoading] = useState(false) 
  const [userName, setUserName] = useState("") 
  const [password, setPassword] = useState("") 
  const [err, setErr] = useState("") 
  const navigate = useNavigate() 
  const dispatch = useDispatch() 

  const handleSignIn = async () =>{
    setLoading(true) 
    setErr("") 
    try{
            const result = await axios.post(`${serverUrl}/api/auth/signin`,{userName,password},{withCredentials: true})
            dispatch(setUserData(result.data))
            setLoading(false) 
            
    }
    catch (error) {
      console.log(error) 
      setLoading(false) 
      setErr(error.response?.data?.message) 
  } 
    }
    
  
  return (
    <div className='w-full h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col justify-center items-center'> 
      <div className='w-[90%] lg:max-w[60%] h-[700px] bg-white rounded-2xl flex justify-center items-center overflow-hidden border-2 border-[#1a1f23]'> 
        {/* left side */}
        <div className='w-full lg:w-[50%] h-full bg-white flex flex-col items-center justify-center p-[10px] gap-[20px]'>
         <div className='flex gap-[10px] items-center text-[30px] font-semibold mt-[40px]'> 
            <span>Sign In to </span>
            <img src={logo} alt="logo"  className='w-[100px]'/>
          </div>
            

          <div className='relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl mt-[20px] border-2 border-black' onClick={()=>setInputClicked({...inputClicked,userName:true})}> 
              <label htmlFor='name' className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] ${inputClicked.userName?"top-[-15px]":""}`}> Enter Username  </label>
                <input type="text" id='user' className ='w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0' required onChange={(e)=>setUserName(e.target.value)} value={userName}/>
              
          </div>

          

          <div className='relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl mt-[20px] border-2 border-black' onClick={()=>setInputClicked({...inputClicked,password:true})}> 
              <label htmlFor='password' className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] ${inputClicked.password?"top-[-15px]":""}`}> Enter Password  </label>
                <input type={showPassword?"text":"password"} id='password' className ='w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0' required onChange={(e)=>setPassword(e.target.value)} value={password}/>
                {!showPassword?<IoEye className='absolute cursor-pointer right-[20px] w-[25px] h-[25px] 'onClick={()=>setShowPassword(true)}/>:<IoEyeOff className='absolute cursor-pointer right-[20px] w-[25px] h-[25px]' onClick={()=>setShowPassword(false)}/>}

              
          </div>

          <div className='w-[93%] px-[20px] cursor-pointer' onClick={()=>navigate("/forgot-password")}>Forgot Password</div> 

          {err && <p className='text-red-500'>{err}</p>}

          <button className='w-[50%] px-[20px] py-[10px] bg-black text-white font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]' onClick={handleSignIn} disabled={loading}>{loading?<ClipLoader size={30} color='white'/>:"Sign In"}</button> 
          <p className='cursor-pointer text-gray-800'>Want To Create A New Account? <span className='border-b-2 border-b-black pb-[3px] text-black' onClick={()=>navigate("/signup")}>Sign Up</span></p>

        </div>
        {/* right div */}
        <div className='md:w-[50%] h-full hidden lg:flex justify-center items-center bg-[#000000] flex-col gap-[10px] text-white text-[16px] font-semibold rounded-1-[30px] shadow-2xl shadow-black'> 
          <img src={logo} alt="" className='w-[50%]' />
          <p className='text-center max-w-[250px] leading-relaxed text-lg'>
          Catch the VIBE. Create the moment.
          </p>
  

        </div>

      </div>

    </div>

  )
}

export default SignIn