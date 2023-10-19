/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { updateChatData, updateSelectedChatData } from "./store/counterSlice";
import { io } from "socket.io-client";
import { SOCKET_URL } from "./components/common/API/urls";
import "./App.css";

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
  const dispatch = useDispatch();

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
          height: "90%",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          overflow: selectedChat ? "auto" : "hidden",
          scrollBehavior: "smooth",
          background: "#e9ecef",
        }}
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
          <img src="./images/chat.svg" />
        )}
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
    <div className="flex" style={{ height: "7%", padding: "10px" }}>
      {selectedChat ? (
        <>
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
        </>
      ) : (
        <div>Please select the chat</div>
      )}
    </div>
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
    <div style={{ display: "flex", flexDirection: "column", width: "85%" }}>
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
