import { useContext, useEffect, useState } from "react";

import assets from "../assets/assets";

import ChatContext from "../../context/ChatContext";
import AuthContext from "../../context/AuthContext";

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext);

  const { logout, onlineUsers } = useContext(AuthContext);

  const [msgImages, setMsgImages] = useState([]);

  // Get all images from messages
  useEffect(() => {
    setMsgImages(
      messages
        .filter((msg) => msg.image)
        .map((msg) => msg.image)
    );
  }, [messages]);

  return (
  selectedUser && (
    <div
      className={`
        relative
        w-full
        h-full
        overflow-y-auto
        text-white
        bg-[#071832]/70
        border-l
        border-white/10
        ${selectedUser ? "max-md:hidden" : ""}
      `}
    >
      {/* User Information */}
      <div className="pt-12 px-5 flex flex-col items-center text-center">

        {/* Profile Picture */}
        <div
          className="
            w-24
            h-24
            rounded-full
            p-[3px]
            bg-gradient-to-br
            from-blue-400
            via-blue-600
            to-cyan-500
            shadow-xl
            shadow-blue-900/40
          "
        >
          <img
            src={
              selectedUser?.profilePic ||
              assets.avatar_icon
            }
            alt="Profile"
            className="
              w-full
              h-full
              rounded-full
              object-cover
              border-4
              border-[#071832]
            "
          />
        </div>

        {/* Name + Online Status */}
        <h1
          className="
            mt-4
            text-xl
            font-semibold
            flex
            items-center
            gap-2
          "
        >
          {selectedUser.fullName}

          {onlineUsers.includes(selectedUser._id) && (
            <span
              className="
                w-2.5
                h-2.5
                rounded-full
                bg-blue-400
                shadow
                shadow-blue-400/70
              "
            />
          )}
        </h1>

        {/* Online / Offline */}
        <p className="text-xs mt-1">
          {onlineUsers.includes(selectedUser._id) ? (
            <span className="text-blue-400">
              Online
            </span>
          ) : (
            <span className="text-blue-100/40">
              Offline
            </span>
          )}
        </p>

        {/* Bio */}
        <p
          className="
            mt-3
            max-w-[280px]
            text-sm
            leading-5
            text-blue-100/60
          "
        >
          {selectedUser.bio || "No bio available"}
        </p>
      </div>

      {/* Divider */}
      <div className="mx-5 my-6 h-px bg-white/10" />

      {/* Media */}
      <div className="px-5 pb-24">

        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-white">
            Media
          </p>

          <span className="text-xs text-blue-100/40">
            {msgImages.length} files
          </span>
        </div>

        {/* Media Grid */}
        {msgImages.length > 0 ? (
          <div
            className="
              mt-4
              max-h-[240px]
              overflow-y-auto
              grid
              grid-cols-2
              gap-3
              pr-1
            "
          >
            {msgImages.map((url, idx) => (
              <div
                key={idx}
                onClick={() => window.open(url)}
                className="
                  group
                  cursor-pointer
                  rounded-xl
                  overflow-hidden
                  border
                  border-white/10
                  bg-white/5
                  hover:border-blue-400/40
                  transition-all
                "
              >
                <img
                  src={url}
                  alt="Shared media"
                  className="
                    w-full
                    aspect-square
                    object-cover
                    opacity-80
                    group-hover:opacity-100
                    group-hover:scale-105
                    transition-all
                    duration-300
                  "
                />
              </div>
            ))}
          </div>
        ) : (
          <div
            className="
              mt-4
              py-8
              rounded-xl
              border
              border-dashed
              border-white/10
              bg-white/5
              text-center
            "
          >
            <p className="text-xs text-blue-100/40">
              No shared media yet
            </p>
          </div>
        )}
      </div>

      {/* Logout */}
      <button
        onClick={() => logout()}
        className="
          absolute
          bottom-5
          left-1/2
          -translate-x-1/2
          w-[80%]
          py-2.5
          rounded-xl
          bg-gradient-to-r
          from-blue-600
          to-blue-800
          text-white
          text-sm
          font-medium
          shadow-lg
          shadow-blue-900/30
          hover:from-blue-500
          hover:to-blue-700
          hover:shadow-blue-500/20
          hover:-translate-y-0.5
          active:translate-y-0
          transition-all
          duration-200
          cursor-pointer
        "
      >
        Logout
      </button>
    </div>
  )
);
};

export default RightSidebar;