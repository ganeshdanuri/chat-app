/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Kbd,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import {
  updateChatData,
  updateSelectedChatData,
} from "../../store/counterSlice";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../common/API/urls";
import { ChatIcon } from "../../assets/SVGIcons/ChatsIcon";
import { IconWrapper } from "../../assets/SVGIcons/IconWrapper";
import { UsersIcon } from "../../assets/SVGIcons/UsersIcon";
import SendIcon from "../../assets/SVGIcons/SendIcon";
import SearchIcon from "../../assets/SVGIcons/SearchIcon";
import "./index.css";
import StarIcon from "../../assets/SVGIcons/StarIcon";
import MenuIcon from "../../assets/SVGIcons/MenuIcon";
import {
  ClearIcon,
  DeleteDocumentIcon,
} from "../../assets/SVGIcons/DeleteIcon";

const ChatHeader = () => {
  const selectedChat = useSelector((store) => store.chat.selectedChat);
  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";
  return selectedChat ? (
    <div className="chat-header">
      <div className="buttons-container">
        {/* <Popover placement="left" >
          <PopoverTrigger>
            <Button
              isIconOnly
              // color="warning"
              // variant="faded"
              aria-label="Take a photo"
              style={{ backgroundColor: "#ffffff" }}
            >
              <SearchIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Input size="md" isClearable placeholder="Search..." />
          </PopoverContent>
        </Popover> */}

        <Button
          isIconOnly
          // color="warning"
          // variant="faded"
          aria-label="Take a photo"
          style={{ backgroundColor: "#ffffff" }}
        >
          <StarIcon />
        </Button>

        <Dropdown>
          <DropdownTrigger>
            <Button
              isIconOnly
              // color="warning"
              // variant="faded"
              aria-label="Take a photo"
              style={{ backgroundColor: "#ffffff" }}
            >
              <MenuIcon />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            variant="faded"
            aria-label="Dropdown menu with description"
          >
            <DropdownItem
              key="edit"
              showDivider
              description="Allows clear the chat history"
              startContent={<ClearIcon />}
            >
              Clear History
            </DropdownItem>
            <DropdownItem
              key="delete"
              className="text-danger"
              color="danger"
              description="Permanently delete chat"
              startContent={<DeleteDocumentIcon className={iconClasses} />}
            >
              Delete Chat
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  ) : null;
};

const ChatArea = ({ chatContainerRef, userInfo }) => {
  const selectedChat = useSelector((store) => store.chat.selectedChat);

  const scrollToBottom = () => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  };

  // Scroll to the bottom whenever the messages change
  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.chats]);

  return (
    <>
      <div
        key={uuidv4()}
        ref={chatContainerRef}
        id="chatContainer"
        style={{
          overflow: selectedChat ? "auto" : "hidden",
        }}
        className={
          !selectedChat ? "chat-container items-center" : "chat-container"
        }
      >
        {selectedChat ? (
          selectedChat?.chats?.length > 0 &&
          selectedChat.chats.map((ch) => {
            return (
              <div
                key={uuidv4()}
                style={{
                  display: "flex",
                  justifyContent:
                    ch?.sender !== userInfo?.username ? "start" : "end",
                  alignItems: "start",
                }}
              >
                <span
                  key={uuidv4()}
                  style={{
                    alignSelf:
                      ch?.sender === userInfo?.username ? "end" : "start",
                    padding: "5px 10px",
                    textAlign: "start",
                    background:
                      ch?.sender !== userInfo?.username ? "#DCE6FF" : "#3D64FD",
                    color:
                      ch?.sender !== userInfo?.username ? "#000000" : "#ffffff",
                    maxWidth: "40%",
                    margin: "5px",
                    borderRadius:
                      ch.sender === userInfo?.username
                        ? "10px 10px 0 10px"
                        : "10px 10px 10px 0",
                  }}
                >
                  <span>{ch.content}</span>
                </span>
              </div>
            );
          })
        ) : (
          <>
            <img src="./images/chat.svg" />
            <div className="flex gap-4">
              <Kbd>Connect</Kbd>
              <Kbd>Chat</Kbd>
              <Kbd>Repeat</Kbd>
            </div>
          </>
        )}
      </div>
      <div className="mobile-footer-container">
        <IconWrapper className="bg-secondary/10 text-secondary">
          <ChatIcon className="text-lg " />
        </IconWrapper>
        <IconWrapper className="bg-warning/10 text-warning">
          <UsersIcon />
        </IconWrapper>
      </div>
    </>
  );
};

const Footer = ({ socket, userInfo }) => {
  const dispatch = useDispatch();
  const [userInput, setUserInput] = useState("");
  const selectedChat = useSelector((store) => store.chat.selectedChat);

  const handleSend = () => {
    if (userInput) {
      const newMessage = {
        sender: userInfo.username,
        receiver: localStorage.getItem("receiver"),
        content: userInput,
      };
      socket.emit("sendMessage", newMessage);
      dispatch(updateChatData(newMessage));
      dispatch(updateSelectedChatData(newMessage));
      setUserInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <>
      {selectedChat && (
        <div className="flex input-container" style={{ height: "8%" }}>
          <Input
            onChange={(e) => {
              setUserInput(e.target.value);
            }}
            size="md"
            value={userInput}
            placeholder="Type your message..."
            onKeyDown={handleKeyDown}
          />

          <Button
            isIconOnly
            aria-label="Take a photo"
            size="lg"
            variant="def"
            onClick={handleSend}
          >
            <SendIcon />
          </Button>
        </div>
      )}
    </>
  );
};

function Chat({ userInfo }) {
  const chatContainerRef = useRef(null);
  const dispatch = useDispatch();
  const selectedChat = useSelector((store) => store.chat.selectedChat);
  const socket = io(SOCKET_URL, { transports: ["websocket"] });

  // const { isLoading, error, data, isFetching } = useQuery("repoData", () =>
  //   axios
  //     .get("local")
  //     .then((res) => res.data)
  // );

  const scrollToBottom = () => {
    const chatContainer = document.getElementById("chatContainer");
    chatContainer.scrollTop = chatContainer.scrollHeight;
  };

  useEffect(() => {
    if (userInfo.username) {
      socket.emit("join", userInfo?.username);
    }
  }, [userInfo?.username]);

  useEffect(() => {
    // Listen for incoming messages
    if (socket) {
      socket.on("connect", (message) => {
        console.log(message);
      });

      socket.on("receiveMessage", (data) => {
        dispatch(updateSelectedChatData(data));
        dispatch(updateChatData(data));
      });
    }

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
      <ChatHeader userInfo={userInfo} />
      <ChatArea
        chatContainerRef={chatContainerRef}
        scrollToBottom={scrollToBottom}
        userInfo={userInfo}
      />
      <Footer
        scrollToBottom={scrollToBottom}
        socket={socket}
        userInfo={userInfo}
      />
    </div>
  );
}

export default Chat;
