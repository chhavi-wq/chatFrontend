import { useContext } from "react";

import ChatContainer from "../components/ChatContainer";
import RightSidebar from "../components/RightSidebar";
import Sidebar from "../components/Sidebar";

import ChatContext from "../../context/ChatContext";

const HomePage = () => {
  const { selectedUser } = useContext(ChatContext);

  return (
    <div
      className="
        w-full
        h-screen
        text-white
        bg-[#020b1c]
        bg-cover
        bg-center
        sm:px-[4%]
        lg:px-[8%]
        xl:px-[12%]
        sm:py-[3%]
        lg:py-[4%]
        relative
        overflow-hidden
      "
    >
      {/* Background blue glow */}
      <div
        className="
          absolute
          -top-40
          -left-40
          w-[500px]
          h-[500px]
          bg-blue-600/10
          rounded-full
          blur-3xl
          pointer-events-none
        "
      />

      <div
        className="
          absolute
          -bottom-40
          -right-40
          w-[500px]
          h-[500px]
          bg-cyan-500/10
          rounded-full
          blur-3xl
          pointer-events-none
        "
      />

      {/* Main Chat Application */}
      <div
        className={`
          relative
          z-10
          w-full
          h-full
          overflow-hidden
          rounded-2xl
          border
          border-white/15
          bg-white/[0.06]
          backdrop-blur-2xl
          shadow-2xl
          shadow-black/40
          grid
          grid-cols-1
          ${
            selectedUser
              ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]"
              : "md:grid-cols-2"
          }
        `}
      >
        {/* Left Sidebar */}
        <Sidebar />

        {/* Main Chat */}
        <ChatContainer />

        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </div>
  );
};

export default HomePage;