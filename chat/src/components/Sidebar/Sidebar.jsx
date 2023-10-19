import {
  User,
  Spacer,
  Avatar,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import axios from "axios";
import { useEffect, useState } from "react";
import useDebounce from "../../utilities/Hooks/useDebounce";
import { FcSearch } from "react-icons/fc";
import { allUrls } from "../common/API/urls";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedChat } from "../../store/counterSlice";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export const NewSidebar = ({ userInfo }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [seachResults, setSearchResults] = useState([]);
  const [updatedFriends, setUpdatedFriends] = useState();

  const debouncedInputValue = useDebounce(inputValue, 1000);
  const chatData = useSelector((store) => store.chat.chatData);

  const { friends } = userInfo || {};

  useEffect(() => {
    if (friends?.length) {
      setUpdatedFriends(friends);
    }
  }, [friends]);

  useEffect(() => {
    triggerSearch(debouncedInputValue);
  }, [debouncedInputValue]);

  const triggerSearch = async (searchTerm) => {
    if (!searchTerm) return;
    const response = await axios.post(allUrls.SEARCH_USERS_URL, {
      searchTerm,
    });
    if (response.data) {
      setSearchResults(response.data);
    }
  };

  const onChatClick = async (username) => {
    if (!updatedFriends.includes(username)) {
      const response = await axios.post(allUrls.ADD_FRIENDS, {
        from: userInfo.username,
        to: username,
      });
      dispatch(setSelectedChat({ name: username, chats: [] }));
      if (response.data) {
        setUpdatedFriends((prev) => [...prev, username]);
      }
    } else {
      let userChat = chatData.find((chat) => chat.name === username);
      if (userChat) {
        dispatch(setSelectedChat(userChat));
      } else {
        dispatch(setSelectedChat({ name: username, chats: [] }));
      }
    }
    localStorage.setItem("receiver", username);
  };

  return (
    <div
      style={{
        width: "20%",
        height: "100%",
        padding: "10px",
        backgroundColor: "#F8F9FD",
      }}
    >
      <Input
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search or start a new chat"
        startContent={
          <FcSearch className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
        }
      />
      <Spacer y={4} />

      {friends?.length && (
        <div className="w-full flex flex-col gap-4 items-center">
          {friends.map((friend) => {
            return (
              <div
                className="w-full flex justify-start items-center cursor-pointer"
                style={{ padding: "10px" }}
                onClick={() => onChatClick(friend)}
                key={uuidv4()}
              >
                <div>
                  <Avatar
                    isBordered
                    color="primary"
                    name={friend}
                    radius="sm"
                    size="sm"
                  />
                </div>
                <Spacer x={4} />
                <span>{friend}</span>
              </div>
            );
          })}
        </div>
      )}
      <div className="w-full flex flex-col flex-start">
        {seachResults.map(({ username }) => {
          return (
            <div onClick={() => onChatClick(username)} key={uuidv4()}>
              <User
                className="cursor-pointer"
                name={username}
                description="Product Designer"
                avatarProps={{
                  src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
                  isBordered: true,
                }}
              />
              <Spacer y={4} />
            </div>
          );
        })}
      </div>

      <hr />
      <Dropdown placement="bottom-start">
        <DropdownTrigger>
          <User
            as="button"
            avatarProps={{
              isBordered: true,
              src: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
            }}
            className="transition-transform"
            description={`@${userInfo?.username}`}
            name={userInfo?.username}
          />
        </DropdownTrigger>
        <DropdownMenu
          aria-label="User Actions"
          variant="flat"
          onAction={(key) => {
            if (key === "logout") navigate("/login");
          }}
        >
          <DropdownItem key="logout" color="danger">
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};
