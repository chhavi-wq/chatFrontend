import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  // ================= CHECK AUTH =================

  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");

      if (data.success) {
  setAuthUser(data.user);
}
    } catch (error) {
      console.log(
        "Check auth error:",
        error.response?.data || error.message
      );

      // Remove invalid token
      localStorage.removeItem("token");
      setToken(null);
      setAuthUser(null);
    }
  };

  // ================= LOGIN / SIGNUP =================

  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(
        `/api/auth/${state}`,
        credentials
      );

      console.log("Auth response:", data);

      if (!data.success) {
        toast.error(data.message);
        return false;
      }

      // Save user
      setAuthUser(data.userData);

      // Save token
      localStorage.setItem("token", data.token);
      setToken(data.token);

      // Set axios Authorization header
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${data.token}`;

      // Connect socket
     

      toast.success(data.message);

      return true;

    } catch (error) {
      console.log(
        "Auth error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
        "Something went wrong"
      );

      return false;
    }
  };

  // ================= LOGOUT =================

  const logout = () => {
    if (socket) {
      socket.disconnect();
    }

    localStorage.removeItem("token");

    delete axios.defaults.headers.common["Authorization"];

    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    setSocket(null);

    toast.success("Logged out successfully");
  };

  // ================= UPDATE PROFILE =================

  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put(
        "/api/auth/update",
        body
      );

      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated successfully");
      }

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        error.message
      );
    }
  };

  // ================= TOKEN =================

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${token}`;

      checkAuth();
    }
  }, [token]);

  // ================= SOCKET =================

useEffect(() => {
  if (!authUser) return;

  const newSocket = io(backendUrl, {
    query: {
      userId: authUser._id,
    },
  });

  setSocket(newSocket);

  newSocket.on("connect", () => {
    console.log("Socket connected:", newSocket.id);
  });

  newSocket.on("getOnlineUsers", (userIds) => {
    console.log("Online users:", userIds);
    setOnlineUsers(userIds);
  });

  newSocket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  return () => {
    console.log("Cleaning socket:", newSocket.id);

    newSocket.disconnect();
    setSocket(null);
    setOnlineUsers([]);
  };
}, [authUser]);

  // ================= CONTEXT =================

  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;