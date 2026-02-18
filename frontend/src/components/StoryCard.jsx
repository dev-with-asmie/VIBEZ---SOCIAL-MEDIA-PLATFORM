import React, { useEffect, useState } from "react";
import dp from "../assets/empty-dp-image.jpg";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import { RiEye2Line } from "react-icons/ri";
import VideoPlayer from "./VideoPlayer";

function StoryCard({ storyData }) {
  const { userData } = useSelector((state) => state.user);
  const [showViewers, setShowViewers] = useState(false) 
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!storyData) return; 

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          navigate("/");
          return 100;
        }
        return prev + 1;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [navigate, storyData]);

  /* ⛔ NO EARLY RETURN HERE */

  return (
    <div className="w-full max-w-[500px] h-screen border-x-2 border-gray-800 relative bg-black">
        

      {/* LOADING STATE */}
      {!storyData || !storyData.author ? (
        <div className="w-full h-full flex items-center justify-center text-white">
          Loading story...
        </div>
      ) : (
        <>
          {/* TOP BAR */}
          <div className="flex items-center gap-3 absolute top-6 px-4 z-10">
            <MdKeyboardBackspace
              className="text-white cursor-pointer w-6 h-6"
              onClick={() => navigate(`/profile/${userData?.userName}`)}
            />

            <div className="w-10 h-10 rounded-full overflow-hidden border">
              <img
                src={storyData.author.profileImage || dp}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            <span className="text-white font-semibold truncate">
              {storyData.author.userName}
            </span>
          </div>

          {/* STORY CONTENT */}
          <div className="w-full h-full flex items-center justify-center">
            {storyData.mediaType === "image" && (
              <img
                src={storyData.media}
                className="w-[85%] rounded-2xl object-cover"
                alt=""
              />
            )}

            {storyData.mediaType === "video" && (
              <div className="w-[85%]">
                <VideoPlayer media={storyData.media} />
              </div>
            )}
          </div>

          {/* PROGRESS BAR */}
          <div className="absolute top-2 w-full h-1 bg-gray-800">
            <div
              className="h-full bg-white transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* VIEWERS (OWNER ONLY) */}
          {storyData?.author?.userName === userData?.userName && (
            <div className="absolute bottom-0 flex items-center gap-[10px] w-full p-4 text-white bg-gradient-to-t from-black">
              <div className="flex items-center gap-2 mb-2">
                <RiEye2Line />
                <span>{storyData.viewers?.length || 0}</span>
              </div>

              <div className="flex relative h-10">
                {storyData.viewers?.slice(0, 3).map((viewer, index) => (
                  <div 
                    key={index} 
                    className="w-10 h-10 rounded-full overflow-hidden border-2 border-black absolute"
                    style={{ left: index * 18 }} 
                  >  
                    <img 
                      src={viewer?.profileImage || dp}
                      className="w-full h-full object-cover"
                      alt=""    
                    />   
                  </div> 
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
    
  );
}

export default StoryCard;
