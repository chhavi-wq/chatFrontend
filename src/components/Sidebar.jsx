import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import ChatContext from "../../context/ChatContext";

const Sidebar = () => {
  const navigate = useNavigate();
const [showMenu, setShowMenu] = useState(false);
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  } = useContext(ChatContext);

  const { authUser, logout, onlineUsers } = useContext(AuthContext);

  const [input, setInput] = useState("");

  // Filter users according to search input
  const filteredUser = input
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : users;

  // Get users when online users change
  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  return (
  <div
    className={`
      h-full
      p-4
      sm:p-5
      rounded-r-2xl
      overflow-y-auto
      text-white
      bg-[#071832]/70
      border-r
      border-white/10
      ${selectedUser ? "max-md:hidden" : ""}
    `}
  >
    <div className="pb-5">

      {/* Header */}
      <div className="flex justify-between items-center">

        <div className="flex items-center gap-2">
          <div
            className="
              w-10
              h-10
              rounded-xl
              flex
              items-center
              justify-center
              bg-blue-600/20
              border
              border-blue-400/20
            "
          >
            <img
              src="/message.png"
              alt="logo"
              className="w-7 h-7 object-contain"
            />
          </div>

          <div>
            <h1 className="font-semibold text-lg">
              Chat App
            </h1>

            <p className="text-[11px] text-blue-200/50">
              Messages
            </p>
          </div>
        </div>

        {/* Menu */}
        <div className="relative">

          <button
            onClick={() =>
              setShowMenu((prev) => !prev)
            }
            className="
              w-9
              h-9
              rounded-lg
              flex
              items-center
              justify-center
              bg-white/5
              border
              border-white/10
              hover:bg-blue-600/20
              hover:border-blue-400/30
              transition-all
              cursor-pointer
            "
          >
            <img
              src={assets.menu_icon}
              alt="Menu"
              className="w-5 h-5 opacity-80"
            />
          </button>

          {showMenu && (
            <div
              className="
                absolute
                top-11
                right-0
                z-20
                w-40
                p-2
                rounded-xl
                bg-[#071832]
                border
                border-white/15
                shadow-2xl
                shadow-black/40
              "
            >
              <p
                onClick={() => {
                  navigate("/profile");
                  setShowMenu(false);
                }}
                className="
                  px-3
                  py-2.5
                  rounded-lg
                  cursor-pointer
                  text-sm
                  text-blue-100/80
                  hover:bg-blue-600/20
                  hover:text-white
                  transition
                "
              >
                Edit Profile
              </p>

              <div className="h-px bg-white/10 my-1" />

              <p
                onClick={() => {
                  logout();
                  setShowMenu(false);
                }}
                className="
                  px-3
                  py-2.5
                  rounded-lg
                  cursor-pointer
                  text-sm
                  text-red-300/80
                  hover:bg-red-500/10
                  hover:text-red-300
                  transition
                "
              >
                Logout
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Search bar */}
      <div
        className="
          bg-white/5
          border
          border-white/10
          rounded-xl
          flex
          items-center
          gap-3
          py-3
          px-4
          mt-5
          focus-within:border-blue-500/50
          focus-within:bg-blue-500/5
          transition-all
        "
      >
        <img
          src={assets.search_icon}
          alt="Search"
          className="w-4 h-4 opacity-60"
        />

        <input
          onChange={(e) =>
            setInput(e.target.value)
          }
          value={input}
          type="text"
          className="
            bg-transparent
            border-none
            outline-none
            text-white
            text-sm
            placeholder-blue-100/40
            flex-1
          "
          placeholder="Search User"
        />
      </div>
    </div>

    {/* Users */}
    <div className="flex flex-col gap-1">

      {filteredUser.map((user) => (

        <div
          onClick={() => {
            setSelectedUser(user);

            setUnseenMessages((prev) => ({
              ...prev,
              [user._id]: 0,
            }));
          }}
          key={user._id}
          className={`
            relative
            flex
            items-center
            gap-3
            p-3
            rounded-xl
            cursor-pointer
            transition-all
            duration-200
            group

            ${
              selectedUser?._id === user._id
                ? `
                  bg-blue-600/20
                  border
                  border-blue-500/30
                `
                : `
                  border
                  border-transparent
                  hover:bg-white/5
                  hover:border-white/10
                `
            }
          `}
        >

          {/* Profile picture */}
          <div className="relative shrink-0">

            <img
              src={
                user?.profilePic ||
                assets.avatar_icon
              }
              alt=""
              className="
                w-10
                h-10
                rounded-full
                object-cover
                border
                border-white/10
              "
            />

            {/* Online indicator */}
            {onlineUsers.includes(user._id) && (
              <span
                className="
                  absolute
                  bottom-0
                  right-0
                  w-3
                  h-3
                  rounded-full
                  bg-blue-400
                  border-2
                  border-[#071832]
                  shadow
                  shadow-blue-400/50
                "
              />
            )}
          </div>

          {/* User information */}
          <div className="flex flex-col leading-5 min-w-0">

            <p
              className="
                text-sm
                font-medium
                text-white
                truncate
              "
            >
              {user.fullName}
            </p>

            {onlineUsers.includes(user._id) ? (
              <span className="text-blue-400 text-xs">
                Online
              </span>
            ) : (
              <span className="text-blue-100/40 text-xs">
                Offline
              </span>
            )}
          </div>

          {/* Unseen messages */}
          {unseenMessages[user._id] > 0 && (
            <p
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-xs
                h-5
                min-w-5
                px-1
                flex
                justify-center
                items-center
                rounded-full
                bg-blue-600
                text-white
                font-medium
                shadow
                shadow-blue-600/30
              "
            >
              {unseenMessages[user._id]}
            </p>
          )}
        </div>
      ))}
    </div>
  </div>
);
};

export default Sidebar;