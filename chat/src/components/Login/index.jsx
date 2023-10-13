import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { EyeFilledIcon, EyeSlashFilledIcon } from "../common/svgicons";
import { allUrls } from "../common/API/urls";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  const { pathname } = location;
  const isLogin = pathname === "/login";

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <>
      <div
        class="flex justify-center items-center flex-col"
        style={{ height: "100vh" }}
      >
        {isLogin ? <h1>Login</h1> : <h1>Register</h1>}
        <Input
          label="username"
          variant="bordered"
          placeholder="Enter your username"
          className="max-w-xs"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <Input
          label="Password"
          variant="bordered"
          placeholder="Enter your password"
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          type={isVisible ? "text" : "password"}
          className="max-w-xs"
          isClearable={true}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <Button color="primary" onClick={handleLogin}>
          {isLogin ? "Login" : "Signup"}
        </Button>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};
