import { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import ChatContext from "../../context/ChatContext";
import { toast } from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";

const ChatContainer = () => {
    const {
        messages,
        selectedUser,
        setSelectedUser,
        sendMessages,
        getMessages,
    } = useContext(ChatContext);

    const { authUser, onlineUsers } = useContext(AuthContext);

    const [input, setInput] = useState("");
    const scrollEnd = useRef();

    // Send text message
    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (input.trim() === "") return;

        await sendMessages({
            text: input.trim(),
        });

        setInput("");
    };

    // Send image
    const handleSendImage = async (e) => {
        const file = e.target.files[0];

        if (!file || !file.type.startsWith("image/")) {
            toast.error("Select an image file");
            return;
        }

        const reader = new FileReader();

        reader.onloadend = async () => {
            await sendMessages({
                image: reader.result,
            });

            e.target.value = "";
        };

        reader.readAsDataURL(file);
    };

    // Get messages when selected user changes
    useEffect(() => {
        if (selectedUser) {
            getMessages(selectedUser._id);
        }
    }, [selectedUser]);

    // Scroll to latest message
    useEffect(() => {
        if (scrollEnd.current) {
            scrollEnd.current.scrollIntoView({
                behavior: "smooth",
            });
        }
    }, [messages]);

   return selectedUser ? (
  <div className="h-full overflow-hidden relative bg-[#071832]/40 text-white">

    {/* Header */}
    <div
      className="
        flex
        items-center
        gap-3
        px-4
        border-b
        border-white/10
        bg-[#071832]/50
        backdrop-blur-xl
      "
    >
      {/* User Profile */}
      <div className="relative shrink-0">
        <img
          src={
            selectedUser.profilePic ||
            assets.avatar_icon
          }
          alt=""
          className="
            w-9
            h-9
            rounded-full
            object-cover
            border
            border-white/10
          "
        />

        {onlineUsers?.includes(
          selectedUser._id?.toString()
        ) && (
          <span
            className="
              absolute
              bottom-0
              right-0
              w-2.5
              h-2.5
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

      {/* User Name */}
      <div className="flex-1 min-w-0">
        <p className="text-sm sm:text-base font-medium truncate">
          {selectedUser.fullName}
        </p>

        <p className="text-[11px]">
          {onlineUsers?.includes(
            selectedUser._id?.toString()
          ) ? (
            <span className="text-blue-400">
              Online
            </span>
          ) : (
            <span className="text-blue-100/40">
              Offline
            </span>
          )}
        </p>
      </div>

      {/* Back Button */}
      <img
        src={assets.arrow_icon}
        alt="Back"
        onClick={() => setSelectedUser(null)}
        className="
          md:hidden
          w-6
          h-6
          cursor-pointer
          opacity-70
          hover:opacity-100
          transition
        "
      />

      {/* Help */}
      <button
        className="
          max-md:hidden
          w-8
          h-8
          rounded-lg
          flex
          items-center
          justify-center
          bg-white/5
          border
          border-white/10
          hover:bg-blue-600/20
          hover:border-blue-400/30
          transition
        "
      >
        <img
          src={assets.help_icon}
          className="w-4 opacity-70"
          alt="Help"
        />
      </button>
    </div>

    {/* Chat Area */}
    <div
  className="
    flex
    flex-col
    h-[calc(100%-120px)]
    overflow-y-auto
    p-4
    pb-6
    gap-1
  "
>
    
      {messages.map((mess, idx) => {
        const isOwnMessage =
          mess.senderId?.toString() ===
          authUser?._id?.toString();

        return (
          <div
            key={mess._id || idx}
            className={`
              flex
              items-end
              gap-2
              mb-3
              ${
                isOwnMessage
                  ? "justify-end"
                  : "justify-start"
              }
            `}
          >
            {/* Message */}
            {mess.image ? (
              <div
                className={`
                  max-w-[230px]
                  rounded-2xl
                  overflow-hidden
                  border
                  border-white/10
                  shadow-lg
                  ${
                    isOwnMessage
                      ? "rounded-br-sm"
                      : "rounded-bl-sm"
                  }
                `}
              >
                <img
                  src={mess.image}
                  alt="Shared"
                  className="
                    w-full
                    object-cover
                    cursor-pointer
                    hover:scale-105
                    transition-transform
                    duration-300
                  "
                  onClick={() =>
                    window.open(mess.image)
                  }
                />
              </div>
            ) : (
              <p
                className={`
                  px-4
                  py-2.5
                  max-w-[75%]
                  md:max-w-[60%]
                  text-sm
                  leading-5
                  break-words
                  shadow-lg

                  ${
                    isOwnMessage
                      ? `
                        bg-gradient-to-br
                        from-blue-600
                        to-blue-800
                        text-white
                        rounded-2xl
                        rounded-br-sm
                        shadow-blue-900/20
                      `
                      : `
                        bg-white/10
                        backdrop-blur-md
                        border
                        border-white/10
                        text-blue-50
                        rounded-2xl
                        rounded-bl-sm
                      `
                  }
                `}
              >
                {mess.text}
              </p>
            )}

            {/* Avatar + Time */}
            <div className="flex flex-col items-center shrink-0">
              <img
                src={
                  isOwnMessage
                    ? authUser?.profilePic ||
                      assets.avatar_icon
                    : selectedUser?.profilePic ||
                      assets.avatar_icon
                }
                className="
                  w-7
                  h-7
                  rounded-full
                  object-cover
                  border
                  border-white/10
                "
                alt=""
              />

              <p className="text-[9px] text-blue-100/30 mt-1 whitespace-nowrap">
                {formatMessageTime(
                  mess.createdAt
                )}
              </p>
            </div>
          </div>
        );
      })}

      {/* Scroll target */}
      <div ref={scrollEnd} />
    </div>

    {/* Bottom Input Area */}
    <div
      className="
        absolute
        bottom-0
        left-0
        right-0
        p-3
        sm:p-4
        bg-gradient-to-t
        from-[#06152e]
        via-[#06152e]/95
        to-transparent
      "
    >
      <div className="flex items-center gap-2">

        {/* Input Container */}
        <div
          className="
            flex
            flex-1
            items-center
            bg-white/5
            border
            border-white/10
            px-2
            pl-4
            rounded-2xl
            backdrop-blur-xl
            focus-within:border-blue-500/50
            focus-within:bg-blue-500/5
            transition-all
          "
        >
          <input
            onChange={(e) =>
              setInput(e.target.value)
            }
            value={input}
            onKeyDown={(e) =>
              e.key === "Enter"
                ? handleSendMessage(e)
                : null
            }
            type="text"
            placeholder="Write a message..."
            className="
              flex-1
              bg-transparent
              text-sm
              py-3
              outline-none
              text-white
              placeholder-blue-100/30
            "
          />

          {/* Image Upload */}
          <input
            onChange={handleSendImage}
            type="file"
            id="image"
            accept="image/png, image/jpeg"
            hidden
          />

          <label
            htmlFor="image"
            className="
              w-9
              h-9
              rounded-xl
              flex
              items-center
              justify-center
              cursor-pointer
              hover:bg-blue-500/10
              transition
            "
          >
            <img
              src={assets.gallery_icon}
              className="
                w-5
                opacity-60
                hover:opacity-100
                transition
              "
              alt="Gallery"
            />
          </label>
        </div>

        {/* Send Button */}
        <button
          onClick={handleSendMessage}
          className="
            w-11
            h-11
            shrink-0
            rounded-xl
            flex
            items-center
            justify-center
            bg-gradient-to-br
            from-blue-500
            to-blue-700
            shadow-lg
            shadow-blue-900/40
            hover:from-blue-400
            hover:to-blue-600
            hover:scale-105
            active:scale-95
            transition-all
            cursor-pointer
          "
        >
          <img
            src={assets.send_button}
            className="w-5"
            alt="Send"
          />
        </button>
      </div>
    </div>
  </div>
) : (
  <div
    className="
      flex
      flex-col
      items-center
      justify-center
      gap-4
      text-center
      bg-[#071832]/40
      max-md:hidden
      h-full
      border-l
      border-white/5
    "
  >
    <div
      className="
        w-20
        h-20
        rounded-2xl
        flex
        items-center
        justify-center
        bg-blue-600/10
        border
        border-blue-400/10
        shadow-xl
        shadow-blue-900/20
      "
    >
      <img
        src="/message.png"
        className="w-12 opacity-70"
        alt="Messages"
      />
    </div>

    <div>
      <p className="text-xl font-semibold text-white">
        Chat Anytime, Anywhere
      </p>

      <p className="text-sm text-blue-100/40 mt-1">
        Select a conversation to start messaging
      </p>
    </div>
  </div>
);
};

export default ChatContainer;