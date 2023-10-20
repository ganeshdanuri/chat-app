/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Button, Input, Kbd } from "@nextui-org/react";
import { useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import {
  updateChatData,
  updateSelectedChatData,
} from "../../store/counterSlice";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../common/API/urls";
import "./index.css";
import { ChatIcon } from "../../assets/SVGIcons/ChatsIcon";
import { IconWrapper } from "../../assets/SVGIcons/IconWrapper";
import { UsersIcon } from "../../assets/SVGIcons/UsersIcon";

const ChatHeader = ({ selectedChat }) => {
  return (
    <div>
      <div>{selectedChat?.name.toUpperCase()}</div>
      <hr />
    </div>
  );
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
          selectedChat?.chats?.length &&
          selectedChat.chats.map((ch) => {
            return (
              <>
                <span
                  key={uuidv4()}
                  style={{
                    alignSelf:
                      ch?.sender === userInfo?.username ? "end" : "start",
                    padding: "2px 10px",
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
                  {ch.content}
                </span>
              </>
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
  const inputRef = useRef(null);
  const buttonRef = useRef(null);
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

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      buttonRef.current?.click();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current?.addEventListener("keypress", handleKeyPress);
    }

    return () => {
      if (inputRef?.current) {
        inputRef.current?.removeEventListener("keypress", handleKeyPress);
      }
    };
  }, []);

  return (
    <>
      {selectedChat && (
        <div
          className="flex input-container"
          style={{ height: "7%", padding: "10px" }}
        >
          <Input
            ref={inputRef}
            onChange={(e) => {
              setUserInput(e.target.value);
            }}
            size="sm"
            value={userInput}
            placeholder="Type your message..."
          />
          <Button
            size="sm"
            color="primary"
            variant="solid"
            ref={buttonRef}
            onClick={handleSend}
          >
            Send
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
      <ChatHeader selectedChat={selectedChat} />
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
