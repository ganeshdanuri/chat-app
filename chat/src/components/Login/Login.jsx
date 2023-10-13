import React from "react";
import {
  Tabs,
  Tab,
  Input,
  Link,
  Button,
  Card,
  CardBody,
  CardHeader,
} from "@nextui-org/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { allUrls } from "../common/API/urls";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setChatData } from "../../store/counterSlice";

export default function LoginNew() {
  const [selected, setSelected] = React.useState("login");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    navigate(`/${selected}`);
  }, [selected]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const username = formData.get("username");
    const password = formData.get("password");
    const displayName = formData.get("displayName");

    if (!username || !password) return;

    const response = await axios.post(
      selected === "login" ? allUrls.LOGIN_URL : allUrls.REGISTER_URL,
      {
        username,
        password,
      }
    );

    const { data } = response;
    if (data?.message) {
      toast(`🦄 ${data.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }

    if (data?.status === 1) {
      localStorage.setItem("jwtToken", data.jwtToken);
      localStorage.setItem("userInfo", JSON.stringify(data.user));

      if (data.user.chats) {
        dispatch(setChatData(data.user.chats));
      }
      console.log({ data });

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col w-full items-center justify-center h-screen">
      <Card className="max-w-full w-[340px] h-[400px]">
        <CardBody className="overflow-hidden">
          <Tabs
            fullWidth
            size="md"
            aria-label="Tabs form"
            selectedKey={selected}
            onSelectionChange={(e) => setSelected(e)}
          >
            <Tab key="login" title="Login">
              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => handleSubmit(e)}
              >
                <Input
                  name="username"
                  isRequired
                  label="Username"
                  placeholder="Enter your username"
                  type="text"
                />
                <Input
                  isRequired
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                />
                <p className="text-center text-small">
                  Need to create an account?{" "}
                  <Link size="sm" onPress={() => setSelected("sign-up")}>
                    Sign up
                  </Link>
                </p>
                <div className="flex gap-2 justify-end">
                  <Button fullWidth color="primary" type="submit">
                    Login
                  </Button>
                </div>
              </form>
            </Tab>
            <Tab key="sign-up" title="Sign up">
              <form
                className="flex flex-col gap-4 h-[300px]"
                onSubmit={(e) => handleSubmit(e)}
              >
                <Input
                  isRequired
                  name="displayName"
                  label="Name"
                  placeholder="Enter your name"
                  type="password"
                />
                <Input
                  isRequired
                  name="username"
                  label="username"
                  placeholder="Enter your username"
                  type="text"
                />
                <Input
                  isRequired
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                />
                <p className="text-center text-small">
                  Already have an account?{" "}
                  <Link size="sm" onPress={() => setSelected("login")}>
                    Login
                  </Link>
                </p>
                <div className="flex gap-2 justify-end">
                  <Button fullWidth color="primary" type="submit">
                    Sign up
                  </Button>
                </div>
              </form>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}
