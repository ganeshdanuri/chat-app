import Chat from "./chat";
import { NewSidebar } from "./components/Sidebar/Sidebar";

export const App = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  return (
    <div className="flex flex-row w-full h-screen">
      <Chat userInfo={userInfo} />
      <NewSidebar userInfo={userInfo} />
    </div>
  );
};
