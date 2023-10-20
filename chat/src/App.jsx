import Chat from "./components/Chat";
import Sidebar from "./components/Sidebar";

import "./App.css";

export const App = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  return (
    <div className="flex flex-row w-full app-container">
      <Sidebar userInfo={userInfo} />
      <Chat userInfo={userInfo} />
    </div>
  );
};
