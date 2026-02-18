import React, { use, useEffect, useState } from "react";
import dp from "../assets/empty-dp-image.jpg";
import VideoPlayer from "./VideoPlayer";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { FaRegComment, FaRegBookmark, FaBookmark } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setPostData } from "../redux/postSlice";
import { setUserData } from "../redux/userSlice";
import FollowButton from "./FollowButton";
import { useNavigate } from "react-router-dom";


function Post({ post }) {
  if (!post) return null; // 🔐 safety

  const { userData } = useSelector((state) => state.user);
  const { postData } = useSelector((state) => state.post);
  const { socket } = useSelector((state) => state.socket);  
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const [showComment, setShowComment] = useState(false);
  const [message, setMessage] = useState("");

  const handleLike = async () => {
    try {
      const res = await axios.get(
        `${serverUrl}/api/post/like/${post._id}`,
        { withCredentials: true }
      );

      const updatedPosts = postData.map((p) =>
        p._id === post._id ? res.data : p
      );

      dispatch(setPostData(updatedPosts));
    } catch (err) {
      console.log(err);
    }
  };

  const handleComment = async () => {
    if (!message.trim()) return;

    try {
      const res = await axios.post(
        `${serverUrl}/api/post/comment/${post._id}`,
        { message },
        { withCredentials: true }
      );

      const updatedPosts = postData.map((p) =>
        p._id === post._id ? res.data : p
      );

      dispatch(setPostData(updatedPosts));
      setMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  {/*const handleSaved = async () => {
    try {
      const res = await axios.get(
        `${serverUrl}/api/post/saved/${post._id}`,
        { withCredentials: true }
      );
      dispatch(setUserData(res.data));
    } catch (err) {
      console.log(err);
    }
  };
  */}
{/*const handleSaved = async () => {
  try {
    const res = await axios.get(
      `${serverUrl}/api/post/saved/${post._id}`,
      { withCredentials: true }
    ); 
    dispatch(setUserData(res.data));
  } catch (err) {
    console.log(err);
  }
};
*/}
const handleSaved = async () => {
  try {
    const res = await axios.get(
      `${serverUrl}/api/post/saved/${post._id}`,
      { withCredentials: true }
    );

    dispatch(setUserData({
      ...userData,
      saved: res.data.saved
    }));

  } catch (err) {
    console.log(err);
  }
};



  {/* useEffect(()=>{
      socket?.on("likedPost",(updatedData)=>{
        const updatedPosts=postData.map((p)=>p._id === post._id?{...p,likes:updatedData.likes}:p)
        dispatch(setPostData(updatedPosts)) 
      })
      socket?.on("commentedPost",(updatedData)=>{
        const updatedPosts=postData.map((p)>p._id === post._id?{...p,comments:updatedData.comments}:p)
        dispatch(setPostData(updatedPosts)) 
      })
      return ()=>{socket?.off("likedPost")
         socket?.off("commentedPost")
      }
  },[socket,postData,dispatch]) */}

  
  {/*useEffect(() => {
  if (!socket) return;

  const handleLikedPost = (updatedPost) => {
    const updatedPosts = postData.map((p) =>
      p._id === updatedPost._id ? updatedPost : p
    );
    dispatch(setPostData(updatedPosts));
  };

  const handleCommentedPost = (updatedPost) => {
    const updatedPosts = postData.map((p) =>
      p._id === updatedPost._id ? updatedPost : p
    );
    dispatch(setPostData(updatedPosts));
  };

  socket.on("likedPost", handleLikedPost);
  socket.on("commentedPost", handleCommentedPost);

  return () => {
    socket.off("likedPost", handleLikedPost);
    socket.off("commentedPost", handleCommentedPost);
  };
}, [socket, postData, dispatch]); */}


  const author = post.author;

  return (
    <div className="w-[90%] bg-white rounded-2xl shadow-2xl pb-5">

      {/* HEADER */}
      <div className="flex justify-between items-center px-5 h-20">
        <div className="flex items-center gap-3">
          <img
            src={author?.profileImage || dp}
            className="w-12 h-12 rounded-full object-cover"
            alt=""
          />
          {/*<span className="font-semibold">
            {author?.userName || "Unknown"}
          </span>*/}

          {/*<span
          className="font-semibold cursor-pointer hover:underline"
          onClick={() => navigate(`/profile/${author?.userName}`)}
          >
          {author?.userName || "Unknown"}
          </span>*/}
          <span
          className="font-semibold cursor-pointer hover:underline"
          onClick={() => author && navigate(`/profile/${author.userName}`)}
          >
          {author?.userName || "Unknown"}
         </span>


        </div>

        {userData?._id !== author?._id && (
          <FollowButton
            targetUserId={author?._id}
            tailwind="px-4 py-1 bg-black text-white rounded-xl "
          />
        )}
      </div>

      {/* MEDIA */}
      <div className="flex justify-center">
        {post.mediaType === "image" && (
          <img
            src={post.media}
            className="w-[80%] rounded-xl object-cover"
            alt=""
          />
        )}

        {post.mediaType === "video" && (
          <div className="w-[80%]">
            <VideoPlayer media={post.media} />
          </div>
        )}
      </div>

      {/* ACTIONS */}
      <div className="flex justify-between items-center px-5 mt-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            {post.likes?.includes(userData?._id) ? (
              <GoHeartFill
                className="text-red-600 cursor-pointer"
                size={25}
                onClick={handleLike}
              />
            ) : (
              <GoHeart
                className="cursor-pointer"
                size={25}
                onClick={handleLike}
              />
            )}
            <span>{post.likes?.length || 0}</span>
          </div>

          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => setShowComment((p) => !p)}
          >
            <FaRegComment size={25} />
            <span>{post.comments?.length || 0}</span>
          </div>
        </div>

        <div onClick={handleSaved} className="cursor-pointer">
          {userData?.saved?.some(p => p._id === post._id) ? (
            <FaBookmark size={25} />
          ) : (
          <FaRegBookmark size={25} />
         )}

        </div>
      </div>

      {/* CAPTION */}
      {/*post.caption && (
        <div className="px-5 mt-2 flex gap-2">
          <span className="font-semibold">
            {author?.userName}
          </span>
          <span>{post.caption}</span>
        </div>
      )} */}
      {post.caption && (
  <div className="px-5 mt-2 text-sm leading-relaxed">
    <span className="font-semibold whitespace-nowrap mr-2">
      {author?.userName}
    </span>
    <span className="break-words">
      {post.caption}
    </span>
  </div>
)}


      {/* COMMENTS */}
      {showComment && (
        <div className="px-5 mt-4">
          <div className="flex items-center gap-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Drop a comment..."
              className="flex-1 border-b outline-none"
            />
            <IoMdSend
              size={22}
              className="cursor-pointer"
              onClick={handleComment}
            />
          </div>

          <div className="mt-4 max-h-64 overflow-auto">
            {post.comments?.map((c, i) => (
              <div key={i} className="flex gap-3 py-2">
                <img
                  src={c.author?.profileImage || dp}
                  className="w-8 h-8 rounded-full"
                  alt=""
                />
                <span className="font-semibold mr-1">{c.author?.userName}</span>
                <span>{c.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Post;
