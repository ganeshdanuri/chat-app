import Chat from "./chat";
import { NewSidebar } from "./components/Sidebar/Sidebar";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { SOCKET_URL } from "./components/common/API/urls";

export const App = () => {
  const socket = io(SOCKET_URL);
  let serializedUserInfo = localStorage.getItem("userInfo");
  const userInfo = JSON.parse(serializedUserInfo);

  useEffect(() => {
    socket.emit("join", userInfo.username);
  }, []);

  return (
    <div className="flex flex-row w-full h-screen">
      <Chat socket={socket} userInfo={userInfo} />
      <NewSidebar userInfo={userInfo} socket={socket} />
    </div>
  );
};
