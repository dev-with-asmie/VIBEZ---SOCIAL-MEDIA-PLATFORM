import React, { useState } from "react";
import logo from "../assets/VIBEZ-LOGO.png";
import { IoEye, IoEyeOff } from "react-icons/io5";
import axios from "axios";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function SignUp() {

  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [focus, setFocus] = useState({
    name:false,
    username:false,
    email:false,
    password:false
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignUp = async () => {
    setLoading(true);
    setErr("");

    try {
      const res = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { name, userName, email, password },
        { withCredentials: true }
      );

      dispatch(setUserData(res.data));
      navigate("/");

    } catch (error) {
      setErr(error.response?.data?.message || "Signup failed");
    }

    setLoading(false);
  };

  return (
    <div className="w-full min-h-screen bg-black flex justify-center items-start overflow-y-auto">

      <div className="w-[95%] max-w-6xl bg-white rounded-2xl flex overflow-hidden shadow-2xl my-auto"> 

        {/* LEFT */}

        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center py-6 gap-5">

          <div className="text-3xl font-semibold flex gap-2 items-center">
            Sign Up to <img src={logo} className="w-[90px]" />
          </div>

          {/* NAME */}

          <div className="relative w-[85%]">
            <input
              className="w-full h-[50px] border-2 border-black rounded-xl px-5 outline-none"
              onFocus={()=>setFocus({...focus,name:true})}
              value={name}
              onChange={(e)=>setName(e.target.value)}
            />
            <label className={`absolute bg-white px-2 left-5 transition-all ${focus.name || name ? "-top-3 text-sm" : "top-3.5"}`}>
              Enter Name
            </label>
          </div>

          {/* USERNAME */}

          <div className="relative w-[85%]">
            <input
              className="w-full h-[50px] border-2 border-black rounded-xl px-5 outline-none"
              onFocus={()=>setFocus({...focus,username:true})}
              value={userName}
              onChange={(e)=>setUserName(e.target.value)}
            />
            <label className={`absolute bg-white px-2 left-5 transition-all ${focus.username || userName ? "-top-3 text-sm" : "top-3.5"}`}>
              Enter Username
            </label>
          </div>

          {/* EMAIL */}

          <div className="relative w-[85%]">
            <input
              className="w-full h-[50px] border-2 border-black rounded-xl px-5 outline-none"
              onFocus={()=>setFocus({...focus,email:true})}
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
            <label className={`absolute bg-white px-2 left-5 transition-all ${focus.email || email ? "-top-3 text-sm" : "top-3.5"}`}>
              Enter Email
            </label>
          </div>

          {/* PASSWORD */}

          <div className="relative w-[85%]">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full h-[50px] border-2 border-black rounded-xl px-5 outline-none"
              onFocus={()=>setFocus({...focus,password:true})}
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />

            <label className={`absolute bg-white px-2 left-5 transition-all ${focus.password || password ? "-top-3 text-sm" : "top-3.5"}`}>
              Enter Password
            </label>

            {showPassword
              ? <IoEyeOff onClick={()=>setShowPassword(false)} className="absolute right-4 top-3 cursor-pointer"/>
              : <IoEye onClick={()=>setShowPassword(true)} className="absolute right-4 top-3 cursor-pointer"/>
            }

          </div>

          {err && <p className="text-red-500">{err}</p>}

          <button
            onClick={handleSignUp}
            disabled={loading}
            className="w-[50%] h-[50px] bg-black text-white rounded-xl mt-4"
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Sign Up"}
          </button>

          <p>
            Already have account?{" "}
            <span onClick={()=>navigate("/signin")} className="border-b cursor-pointer">
              Sign In
            </span>
          </p>

        </div>

        {/* RIGHT */}

        <div className="hidden lg:flex w-1/2 bg-black text-white flex-col justify-center items-center gap-4">


          <img src={logo} className='w-[50%]' />

          <p className="text-center max-w-[250px] leading-relaxed text-lg">
            Catch the VIBE. Create the moment. 
          </p>  

        </div>

      </div>

    </div>
  );
}

export default SignUp;
