import React from "react";
import dp from "../assets/empty-dp-image.jpg";

function NotificationCard({ noti }) {
  return (
    <div className="w-full flex justify-between px-3 py-2 bg-gray-800 rounded-full items-center">

      {/* LEFT SIDE */}
      <div className="flex gap-3 items-center">

        {/* PROFILE IMAGE */}
        <div className="w-[40px] h-[40px] rounded-full overflow-hidden border">
          <img
            src={noti?.sender?.profileImage || dp}
            className="w-full h-full object-cover"
          />
        </div>

        {/* TEXT */}
        <div>
          <h1 className="text-white text-sm font-semibold">
            {noti?.sender?.userName}
          </h1>
          <p className="text-gray-300 text-xs">
            {noti?.message}
          </p>
        </div>

      </div>

      {/* RIGHT SIDE MEDIA */}
      <div className="w-[40px] h-[40px] rounded-full overflow-hidden border">

        {noti?.wave ? (
          <video src={noti.wave.media} muted className="w-full h-full object-cover" />
        ) : noti?.post?.mediaType === "image" ? (
          <img src={noti.post.media} className="w-full h-full object-cover" />
        ) : noti?.post ? (
          <video src={noti.post.media} muted className="w-full h-full object-cover" />
        ) : null}

      </div>

    </div>
  );
}

export default NotificationCard;
