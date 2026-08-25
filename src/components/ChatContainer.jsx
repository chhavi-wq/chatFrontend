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
        <div className="h-full overflow-y-scroll relative backdrop-blur-lg">

            {/* Header */}
            <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">

                <img
                    src={selectedUser.profilePic || assets.avatar_icon}
                    alt=""
                    className="w-8 h-8 rounded-full"
                />

                <p className="flex-1 text-lg text-white flex items-center gap-2">
                    {selectedUser.fullName}

                    {onlineUsers?.includes(selectedUser._id?.toString()) && (
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    )}
                </p>

                <img
                    src={assets.arrow_icon}
                    alt=""
                    onClick={() => setSelectedUser(null)}
                    className="md:hidden max-w-7"
                />

                <img
                    src={assets.help_icon}
                    className="max-md:hidden max-w-5"
                    alt=""
                />
            </div>

            {/* Chat Area */}
            <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">

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
                                    className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"
                                />
                            ) : (
                                <p
                                    className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${
                                        isOwnMessage
                                            ? "rounded-br-none"
                                            : "rounded-bl-none"
                                    }`}
                                >
                                    {mess.text}
                                </p>
                            )}

                            {/* Avatar + Time */}
                            <div className="text-center text-xs">

                                <img
                                    src={
                                        isOwnMessage
                                            ? authUser?.profilePic ||
                                              assets.avatar_icon
                                            : selectedUser?.profilePic ||
                                              assets.avatar_icon
                                    }
                                    className="w-7 h-7 rounded-full"
                                    alt=""
                                />

                                <p className="text-gray-500">
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
            <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">

                <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">

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
                        className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400"
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
                            className="w-5 mr-2 cursor-pointer"
                            alt=""
                        />
                    </label>

                </div>

                <img
                    src={assets.send_button}
                    onClick={handleSendMessage}
                    alt=""
                    className="w-7 cursor-pointer"
                />

            </div>

        </div>
    ) : (
        <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">

            <img
                src="/message.png"
                className="max-w-16"
                alt=""
            />

            <p className="text-lg font-medium text-white">
                Chat Anytime, Anywhere
            </p>

        </div>
    );
};

export default ChatContainer;