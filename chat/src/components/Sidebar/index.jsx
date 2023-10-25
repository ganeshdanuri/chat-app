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
import StarIcon from "../../assets/SVGIcons/StarIcon";
import "./index.css";
import SearchIcon from "../../assets/SVGIcons/SearchIcon";

const Sidebar = ({ userInfo }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [seachResults, setSearchResults] = useState([]);
  const [selectedUsername, setSelectedUsername] = useState("");
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
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }

    const response = await axios.post(allUrls.SEARCH_USERS_URL, {
      searchTerm,
    });
    if (response.data) {
      setSearchResults(response.data);
    }
  };

  const onChatClick = async (username) => {
    if (!updatedFriends?.includes(username)) {
      const response = await axios.post(allUrls.ADD_FRIENDS, {
        from: userInfo.username,
        to: username,
      });
      dispatch(setSelectedChat({ name: username, chats: [] }));
      if (response.data) {
        setUpdatedFriends((prev) => [...(prev || []), username]);
      }
    } else {
      let userChat = chatData.find((chat) => chat.name === username);
      if (userChat) {
        dispatch(setSelectedChat(userChat));
      } else {
        dispatch(setSelectedChat({ name: username, chats: [] }));
      }
    }
    setSelectedUsername(username);
    localStorage.setItem("receiver", username);
  };

  return (
    <div
      className="sidebar-container"
      style={{
        width: "20%",
      }}
    >
      <Input
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search or start a new chat"
        startContent={<SearchIcon />}
      />
      <Spacer y={4} />

      <div style={{ height: "86%", overflowY: "auto", overflowX: "hidden" }}>
        {friends?.length > 0 && (
          <div className="friends-container">
            {friends.map((friend) => {
              return (
                <div
                  onClick={() => onChatClick(friend)}
                  key={uuidv4()}
                  className={
                    selectedUsername === friend
                      ? "selected-friend cursor-pointer friends-item"
                      : "cursor-pointer friends-item"
                  }
                >
                  <div>
                    <Avatar
                      name={friend[0].toUpperCase()}
                      size="sm"
                      radius="sm"
                      className={
                        selectedUsername === friend
                          ? "friend-avtar selected-avtar"
                          : "friend-avtar"
                      }
                    />
                  </div>
                  <Spacer x={4} />
                  <span>{friend}</span>
                  <Spacer x={4} />
                  <StarIcon selected={selectedUsername === friend} />
                </div>
              );
            })}
          </div>
        )}
        {seachResults?.length > 0 ? (
          <div className="friends-container">
            {seachResults
              .filter(({ username }) => username !== userInfo.username)
              .map(({ username }) => {
                return (
                  <div
                    onClick={() => onChatClick(username)}
                    key={uuidv4()}
                    className={
                      selectedUsername === username
                        ? "selected-friend cursor-pointer friends-item"
                        : "cursor-pointer friends-item"
                    }
                  >
                    <div>
                      <Avatar
                        name={username[0].toUpperCase()}
                        size="sm"
                        radius="sm"
                        className={
                          selectedUsername === username
                            ? "friend-avtar selected-avtar"
                            : "friend-avtar"
                        }
                      />
                    </div>
                    <Spacer x={4} />
                    <span>{username}</span>
                    <Spacer x={4} />
                    <StarIcon selected={selectedUsername === username} />
                  </div>
                );
              })}
          </div>
        ) : (
          inputValue && <div> No Results found !! </div>
        )}
      </div>
      <hr />
      <div className="items-center" style={{ padding: "10px" }}>
        <Dropdown placement="bottom-start">
          <DropdownTrigger>
            <User
              as="button"
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
    </div>
  );
};

export default Sidebar;
