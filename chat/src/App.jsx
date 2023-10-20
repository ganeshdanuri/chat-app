import Chat from "./components/Chat";
import Sidebar from "./components/Sidebar";

export const App = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  return (
    <div className="flex flex-row w-full h-screen">
      <Sidebar userInfo={userInfo} />
      <Chat userInfo={userInfo} />
    </div>
  );
};
