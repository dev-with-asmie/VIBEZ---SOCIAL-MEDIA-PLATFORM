{/*import React, { useEffect, useRef, useState } from 'react'
import { FiVolume2 } from "react-icons/fi";
import { FiVolumeX } from "react-icons/fi";
function VideoPlayer({media}) { 
    const videoTag=useRef() 
    const [mute,setMute] = useState(false)
    const [isPlaying,setIsplaying] = useState(true) 

    const toggleMute = () => {
    const video = videoTag.current;

    video.muted = !mute;
    video.volume = 1;
    video.play();   // VERY IMPORTANT

    setMute(!mute);
};

    const handleClick=()=>{
        if(isPlaying){
             videoTag.current.pause() 
             setIsplaying(false) 
        }
        else{
             videoTag.current.play() 
             setIsplaying(true)
        }
    }
    useEffect(()=>{
    const observer = new IntersectionObserver(([entry])=>{
               const video = videoTag.current
               if(entry.isIntersecting){
                      video.play() 
                      setIsplaying(true)  
               }
               else{
                video.pause() 
                setIsplaying(false)   
            }
        },{threshold:0.6})
        if(videoTag.current){
          observer.observe(videoTag.current)  
        }
        return ()=>{
          if(videoTag.current){
          observer.unobserve(videoTag.current)  
        }   
        }

    },[])
    


    return (
        <div className='h-[100%] relative cursor-pointer max-w-full rounded-2xl overflow-hidden'>
             <video ref={videoTag} src={media} autoPlay loop muted={mute} className='h-[100%] relative cursor-pointer max-w-full rounded-2xl overflow-hidden object-cover' onClick={handleClick}/> 
             <div className='absolute bottom-[10px] right-[10px]' onClick={toggleMute}>
                {!mute?<FiVolume2 className='w-[20px] h-[20px] text-white font-semibold'/>:<FiVolumeX className='w-[20px] h-[20px] text-white font-semibold'/>} 
                </div> 
                  

        </div>
    )
}

export default VideoPlayer
*/}
import React, { useEffect, useRef, useState } from "react";
import { FiVolume2, FiVolumeX } from "react-icons/fi";

function VideoPlayer({ media }) {
  const videoTag = useRef(null);
  const [mute, setMute] = useState(true);

  // REQUIRED: user-gesture based unmute
  const toggleMute = async () => {
    const video = videoTag.current;
    if (!video) return;

    video.muted = false;
    video.volume = 1;

    try {
      await video.play();   // must be inside click
      setMute(false);
    } catch (err) {
      console.log("Play failed:", err);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoTag.current;
        if (!video) return;

        if (entry.isIntersecting) {
          video.play();
        } else {
          video.pause();
          video.muted = true;
          setMute(true);
        }
      },
      { threshold: 0.6 }
    );

    if (videoTag.current) observer.observe(videoTag.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="h-[100%] relative cursor-pointer max-w-full rounded-2xl overflow-hidden">
      <video
        ref={videoTag}
        src={media}
        loop
        muted
        playsInline
        className="h-[100%] w-full object-cover"
      />

      <div
        className="absolute bottom-[10px] right-[10px]"
        onClick={toggleMute}
      >
        {mute ? (
          <FiVolumeX className="w-[20px] h-[20px] text-white" />
        ) : (
          <FiVolume2 className="w-[20px] h-[20px] text-white" />
        )}
      </div>
    </div>
  );
}

export default VideoPlayer;
