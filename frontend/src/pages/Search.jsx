import React, { useEffect, useState } from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setSearchData } from "../redux/userSlice";
import dp from "../assets/empty-dp-image.jpg";

function Search() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [input, setInput] = useState("");

  const { searchData } = useSelector((state) => state.user);

  const handleSearch = async () => {
  if (input.length < 3) return;

  try {
    const res = await axios.get(
      `${serverUrl}/api/user/search?keyword=${input}`,
      { withCredentials: true }
    );

    dispatch(setSearchData(res.data));
  } catch (err) {
    console.log(err.response?.data || err.message);
  }
};


  // Call API only when input is NOT empty
  useEffect(() => {
    if (input.length >= 3) {
      handleSearch();
    }
  }, [input]);

  return (
    <div className="w-full min-h-screen bg-black flex flex-col gap-5">

      {/* HEADER */}
      <div className="h-[80px] flex items-center px-5">
        <MdKeyboardBackspace
          className="text-white cursor-pointer w-6 h-6"
          onClick={() => navigate("/")}
        />
      </div>

      {/* SEARCH BAR */}
      <div className="flex justify-center">
        <div className="w-[90%] max-w-[800px] h-[55px] rounded-full bg-[#0f1414] flex items-center px-5">
          <IoSearch className="text-white" />

          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-transparent outline-none px-4 text-white text-lg"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyUp={handleSearch}
          />
        </div>
      </div>

      {/* RESULTS */}
      {input && searchData?.map((user) => (
        <div
          key={user._id}
          className="w-[90%] max-w-[700px] mx-auto h-[80px] bg-white rounded-full flex items-center gap-4 px-4 cursor-pointer hover:bg-gray-200"
          onClick={() => navigate(`/profile/${user.userName}`)}
        >
          <img
            src={user.profileImage || dp}
            className="w-10 h-10 rounded-full object-cover"
            alt=""
          />

          <div>
            <div className="font-semibold">{user.userName}</div>
            <div className="text-sm text-gray-400">{user.name}</div>
          </div>
        </div>
      ))}

    {input && searchData?.length==0 && (
     <div className="text-white text-center mt-10 text-lg"> No User Found ...
      </div>)}

    </div>
  );
}

export default Search;
