import Chat from "./chat";
import { Avatar, Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { NewSidebar } from "./components/Sidebar/Sidebar";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export const App = () => {
  const socket = io("http://localhost:8000");
  let serializedUserInfo = localStorage.getItem("userInfo");
  const userInfo = JSON.parse(serializedUserInfo);

  useEffect(() => {
    socket.emit("join", userInfo.username);
    console.log("triggered");
  }, []);

  const RightBar = () => {
    return <div>r</div>;
  };

  return (
    <div className="flex flex-row w-full h-screen">
      <Chat socket={socket} userInfo={userInfo} />
      {/* <Sidebar userInfo={userInfo} socket={socket} /> */}
      <NewSidebar userInfo={userInfo} socket={socket} />
      {/* <RightBar /> */}
    </div>
  );
};
