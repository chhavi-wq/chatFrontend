import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { AuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";

export const ChatContext = createContext();


export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, axios, authUser } = useContext(AuthContext);

  useEffect(() => {
  if (!socket) return;

  const handleOnlineUsers = (onlineUserIds) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => ({
        ...user,
        online: onlineUserIds.includes(user._id),
      }))
    );
  };

  socket.on("getOnlineUsers", handleOnlineUsers);

  return () => {
    socket.off("getOnlineUsers", handleOnlineUsers);
  };
}, [socket]);
  // ==========================================
  // GET USERS
  // ==========================================
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");

      if (data.success) {
        setUsers(data.users || []);
        setUnseenMessages(data.unseenMessages || {});
      }
    } catch (error) {
      console.log(
        "Get users error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message || error.message
      );
    }
  };

  // ==========================================
  // GET MESSAGES
  // ==========================================
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(
        `/api/messages/${userId}`
      );

      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.log(
        "Get messages error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message || error.message
      );
    }
  };

  // ==========================================
  // SEND MESSAGE
  // ==========================================
  const sendMessages = async (messageData) => {
    
    if (!selectedUser) {
      toast.error("Please select a user");
      return;
    }

    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );

      if (data.success) {
          console.log("SENT MESSAGE:", data);
        setMessages((prevMessages) => [
          ...prevMessages,
          data.newMessage,
        ]);
      }
    } catch (error) {
      console.log(
        "Send message error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message || error.message
      );
    }
  };

  // ==========================================
  // RECEIVE MESSAGE
  // ==========================================
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      console.log("New message:", newMessage);

      if (
        selectedUser &&
        newMessage.senderId === selectedUser._id
      ) {
        newMessage.seen = true;

        setMessages((prevMessages) => [
          ...prevMessages,
          newMessage,
        ]);

        axios.put(
          `/api/messages/mark/${newMessage._id}`
        );
      } else {
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: prev[newMessage.senderId]
            ? prev[newMessage.senderId] + 1
            : 1,
        }));
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedUser]);

  // ==========================================
  // GET USERS AFTER LOGIN
  // ==========================================
  useEffect(() => {
    if (authUser) {
      getUsers();
    }
  }, [authUser, socket]);

  // ==========================================
  // UPDATE SELECTED USER
  // AFTER USER DATA CHANGES
  // ==========================================
  useEffect(() => {
    if (selectedUser && users.length > 0) {
      const updatedUser = users.find(
        (user) => user._id === selectedUser._id
      );

      if (updatedUser) {
        setSelectedUser(updatedUser);
      }
    }
  }, [users]);

  // ==========================================
  // CONTEXT
  // ==========================================
  const value = {
    messages,
    users,
    selectedUser,
    getUsers,
    getMessages,
    sendMessages,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;