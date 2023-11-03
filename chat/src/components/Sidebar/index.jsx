import {
  User,
  Spacer,
  Avatar,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FriendIcon } from "../../assets/SVGIcons/FriendIcon";
import { setSelectedChat } from "../../store/counterSlice";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import SearchIcon from "../../assets/SVGIcons/SearchIcon";
import ChatModal from "../common/Components/Modal";

import "./index.css";

const Sidebar = ({ userInfo }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedUsername, setSelectedUsername] = useState("");
  const [updatedFriends, setUpdatedFriends] = useState();
  const chatData = useSelector((store) => store.chat.chatData);
  const [openModal, setOpenModal] = useState(false);

  const { friends } = userInfo || {};

  useEffect(() => {
    if (friends?.length) {
      setUpdatedFriends(friends);
    }
  }, [friends]);

  console.log({ friends, updatedFriends });

  const onChatClick = async (username) => {
    let userChat = chatData.find((chat) => chat.name === username);
    if (userChat) {
      dispatch(setSelectedChat(userChat));
    } else {
      dispatch(setSelectedChat({ name: username, chats: [] }));
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
      <div className="flex items-center">
        <Input
          placeholder="Search .."
          isClearable
          onValueChange={(value) => console.log(value)}
          startContent={<SearchIcon />}
        />
        <Spacer y={4} />
        <Button
          isIconOnly
          style={{ backgroundColor: "f1f4f6" }}
          onClick={() => setOpenModal(true)}
        >
          <FriendIcon className="cursor-pointer" />
        </Button>
      </div>

      <div style={{ height: "86%", overflowY: "auto", overflowX: "hidden" }}>
        {updatedFriends?.length > 0 && (
          <div className="friends-container">
            {updatedFriends.map((friend) => {
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
                  <Avatar
                    name={friend.username[0]?.toUpperCase()}
                    size="sm"
                    radius="sm"
                    className={
                      selectedUsername === friend
                        ? "friend-avtar selected-avtar"
                        : "friend-avtar"
                    }
                  />
                  <Spacer x={4} />
                  <span>{friend.username}</span>
                  <Spacer x={4} />
                </div>
              );
            })}
          </div>
        )}
      </div>
      <hr />
      <div className="items-center" style={{ padding: "10px" }}>
        <Dropdown placement="bottom-start">
          <DropdownTrigger>
            <User
              as="button"
              className="transition-transform"
              // description={`@${userInfo?.username}`}
              // name={userInfo?.username}
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
      <ChatModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        selectedUsername={selectedUsername}
        userInfo={userInfo}
        setSelectedUsername={setSelectedUsername}
        setUpdatedFriends={setUpdatedFriends}
      />
    </div>
  );
};

export default Sidebar;
