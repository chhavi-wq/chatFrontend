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
    <div className="h-full overflow-y-scroll relative bg-[#06152e] backdrop-blur-lg">

        {/* Header */}
        <div className="flex items-center gap-3 py-4 px-5 border-b border-white/10 bg-[#13131a]/80">

            <img
                src={selectedUser.profilePic || assets.avatar_icon}
                alt=""
                className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-500/30"
            />

            <p className="flex-1 text-lg text-white flex items-center gap-2 font-medium">
                {selectedUser.fullName}

                {onlineUsers?.includes(selectedUser._id?.toString()) && (
                    <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
                )}
            </p>

            <img
                src={assets.arrow_icon}
                alt=""
                onClick={() => setSelectedUser(null)}
                className="md:hidden max-w-7 cursor-pointer opacity-70 hover:opacity-100 transition"
            />

            <img
                src={assets.help_icon}
                className="max-md:hidden max-w-5 opacity-60 hover:opacity-100 transition cursor-pointer"
                alt=""
            />

        </div>

        {/* Chat Area */}
        <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-5 pb-8 space-y-2 scrollbar-thin scrollbar-thumb-white/10">

            {messages.map((mess, idx) => {

                const isOwnMessage =
                    mess.senderId?.toString() ===
                    authUser?._id?.toString();

                return (
                    <div
                        key={mess._id || idx}
                        className={`flex items-end gap-2 ${
                            isOwnMessage
                                ? "justify-end"
                                : "justify-start"
                        }`}
                    >

                        {/* Message */}
                        {mess.image ? (
                            <img
                                src={mess.image}
                                alt=""
                                className="max-w-[230px] rounded-xl border border-white/10 shadow-lg mb-8"
                            />
                        ) : (
                            <p
                                className={`px-4 py-2.5 max-w-[280px] md:text-sm font-light leading-relaxed mb-8 break-words shadow-sm ${
                                    isOwnMessage
                                        ? "bg-violet-600 text-white rounded-2xl rounded-br-sm"
                                        : "bg-white/10 text-gray-100 rounded-2xl rounded-bl-sm border border-white/5"
                                }`}
                            >
                                {mess.text}
                            </p>
                        )}

                        {/* Avatar + Time */}
                        <div className="text-center text-xs shrink-0">

                            <img
                                src={
                                    isOwnMessage
                                        ? authUser?.profilePic ||
                                          assets.avatar_icon
                                        : selectedUser?.profilePic ||
                                          assets.avatar_icon
                                }
                                className="w-7 h-7 rounded-full object-cover ring-1 ring-white/10"
                                alt=""
                            />

                            <p className="text-gray-500 mt-1 text-[10px]">
                                {formatMessageTime(mess.createdAt)}
                            </p>

                        </div>

                    </div>
                );
            })}

            {/* Scroll target */}
            <div ref={scrollEnd}></div>

        </div>

        {/* Bottom Input Area */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-4 bg-gradient-to-t from-[#0f0f14] via-[#0f0f14]/95 to-transparent">

            <div className="flex-1 flex items-center bg-white/[0.07] border border-white/10 px-4 rounded-full focus-within:border-violet-500/50 focus-within:bg-white/[0.09] transition">

                <input
                    onChange={(e) => setInput(e.target.value)}
                    value={input}
                    onKeyDown={(e) =>
                        e.key === "Enter"
                            ? handleSendMessage(e)
                            : null
                    }
                    type="text"
                    placeholder="Send a message"
                    className="flex-1 text-sm py-3 bg-transparent border-none outline-none text-white placeholder-gray-500"
                />

                <input
                    onChange={handleSendImage}
                    type="file"
                    id="image"
                    accept="image/png, image/jpeg"
                    hidden
                />

                <label htmlFor="image">
                    <img
                        src={assets.gallery_icon}
                        className="w-5 mr-2 cursor-pointer opacity-60 hover:opacity-100 transition"
                        alt=""
                    />
                </label>

            </div>

            <img
                src={assets.send_button}
                onClick={handleSendMessage}
                alt=""
                className="w-8 cursor-pointer hover:scale-110 transition-transform"
            />

        </div>

    </div>
) : (
    <div className="flex flex-col items-center justify-center gap-3 text-gray-500 bg-[#0f0f14] max-md:hidden">

        <img
            src="/message.png"
            className="max-w-26 opacity-70"
            alt=""
        />

        <p className="text-lg font-medium text-white">
            Chat Anytime, Anywhere
        </p>

    </div>
);
};

export default ChatContainer;