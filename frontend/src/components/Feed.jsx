import React from 'react'
import logo from "../assets/VIBEZ-LOGO.png" 
import { FaRegHeart } from "react-icons/fa6";
import StoryDp from './StoryDp';
import Nav from './Nav';
import { useSelector } from 'react-redux';
import Post from './Post';
import { FaTelegramPlane } from "react-icons/fa";
import { Navigate, useNavigate } from 'react-router-dom';

function Feed() {
    const {postData} = useSelector(state=>state.post) 
    const {userData,notificationData} = useSelector(state=>state.user)  
    const {storyList,currentUserStory} = useSelector(state=>state.story)  
    const navigate=useNavigate() 
    return (
        <div className='lg:w-[50%] w-full bg-black min-h-[100vh] lg:h-[100vh] relative lg:overflow-y-auto'> 

          <div className='w-full h-[100px] flex items-center justify-between p-[20px] lg:hidden'> 
                          <img src={logo} alt="" className='w-[90px]'/> 
                          <div className='flex items-center gap-[10px]'> 
                              <div className='relative' onClick={()=>navigate("/notifications")}> 
                                                  <FaRegHeart className='text-[white] w-[25px] h-[25px]' /> 
                                                  {notificationData?.length>0 && notificationData.some((noti)=>noti.isRead===false) && 
                                                    (<div className='w-[10px] h-[10px] bg-red-600 rounded-full absolute top-0 right-[-5px]'></div>)}
                              </div>
                              <FaTelegramPlane className='text-[white] w-[25px] h-[25px]' onClick={()=>navigate("/messages")}/>   
                          </div>
                      </div>

                      
                      <div className='flex w-full overflow-auto gap-[20px] items-center p-[20px]'>  
                        <StoryDp userName={"Your Story"} profileImage={userData.profileImage} story={currentUserStory}/>  

                        {/*storyList?.map((story)=>(
                            <StoryDp userName={story.author.userName} ProfileImage={story.author.profileImage} story={story} key={index}/>  

                        ))*/} 
                        {storyList?.map((story) => (
                        <StoryDp
                         key={story._id}
                         userName={story.author?.userName}
                         profileImage={story.author?.profileImage}
                         story={story}
                        />
                        ))}

                        


                    </div>


          <div className='w-full min-h-[100vh] flex flex-col items-center gap-[20px] p-[10px] pt-[40px] bg-white rounded-t-[60px] relative pb-[120px]'>
            <Nav/>
            {/*postData?.map((post,index)=>(
                <Post post={post} key={index}/>
            ))*/}
            {postData?.map((post) => (
            <Post key={post._id} post={post} />
            ))}

            </div> 
        </div>
    )
}
export default Feed 