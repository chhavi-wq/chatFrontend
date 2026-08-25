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
      className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      <div className="pb-5">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center text-center flex-row">
          <img
            src={"/message.png"}
            alt="logo"
            className="max-w-20"
          />
<h1 className="font-bold">Chat App</h1>
</div>
          {/* Menu */}
        <div className="py-2 relative">
  <img
    src={assets.menu_icon}
    alt="Menu"
    className="max-h-5 cursor-pointer"
    onClick={() => setShowMenu((prev) => !prev)}
  />

  {showMenu && (
    <div
      className="absolute top-full right-0 z-20 w-32 p-5 rounded-md
      bg-[#282142] border border-gray-600 text-gray-100"
    >
      <p
        onClick={() => {
          navigate("/profile");
          setShowMenu(false);
        }}
        className="cursor-pointer text-sm"
      >
        Edit Profile
      </p>

      <hr className="my-2 border-t border-gray-500" />

      <p
        onClick={() => {
          logout();
          setShowMenu(false);
        }}
        className="cursor-pointer text-sm"
      >
        Logout
      </p>
    </div>
  )}
</div>
        </div>

        {/* Search bar */}
        <div
          className="bg-[#282142] rounded-full flex items-center gap-2
          py-3 px-4 mt-5"
        >
          <img
            src={assets.search_icon}
            alt="Search"
            className="w-3"
          />

          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            className="bg-transparent border-none outline-none
            text-white text-xs placeholder-[#c8c8c8] flex-1"
            placeholder="Search User"
          />
        </div>
      </div>

      {/* Users */}
      <div className="flex flex-col">
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
            className={`relative flex items-center gap-2 p-2 pl-4
            rounded cursor-pointer max-sm:text-sm
            ${
              selectedUser?._id === user._id
                ? "bg-[#282142]/50"
                : ""
            }`}
          >
            {/* Profile picture */}
            <img
              src={user?.profilePic || assets.avatar_icon}
              alt=""
              className="w-[35px] aspect-square rounded-full"
            />

            {/* User information */}
            <div className="flex flex-col leading-5">
              <p>{user.fullName}</p>

              {onlineUsers.includes(user._id) ? (
                <span className="text-green-400 text-xs">
                  Online
                </span>
              ) : (
                <span className="text-neutral-200 text-xs">
                  Offline
                </span>
              )}
            </div>

            {/* Unseen messages count */}
            {unseenMessages[user._id] > 0 && (
              <p
                className="absolute top-4 right-4 text-xs h-5 w-5
                flex justify-center items-center rounded-full
                bg-violet-500/50"
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