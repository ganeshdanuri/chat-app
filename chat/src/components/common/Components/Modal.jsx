import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Spacer,
  Avatar,
} from "@nextui-org/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { allUrls } from "../API/urls.js";
import useDebounce from "../../../utilities/Hooks/useDebounce.jsx";
import SearchIcon from "../../../assets/SVGIcons/SearchIcon.jsx";
import { MessageSVG } from "../../../assets/SVGIcons/Message.jsx";
import { setSelectedChat } from "../../../store/counterSlice.js";
import { useDispatch } from "react-redux";
import AddSVG from "../../../assets/SVGIcons/AddFriend.jsx";

export default function ChatModal({
  userInfo,
  setUpdatedFriends,
  openModal,
  setOpenModal,
  selectedUsername,
  setSelectedUsername,
}) {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");
  const [seachResults, setSearchResults] = useState([]);
  const debouncedInputValue = useDebounce(inputValue, 1000);

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

  const handleClose = () => {
    setSearchResults([]);
    setOpenModal(false);
  };

  const handleAddNewFriend = async (username) => {
    const response = await axios.post(allUrls.ADD_FRIENDS, {
      from: userInfo.username,
      to: username,
    });
    if (response.data) {
      setUpdatedFriends((prev) => [...(prev || []), username]);
      dispatch(setSelectedChat({ name: username, chats: [] }));
      setSelectedUsername(username);
      setOpenModal(false);
    }
  };

  return (
    <Modal
      isOpen={openModal}
      backdrop="blur"
      onClose={handleClose}
      hideCloseButton={true}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          New Connections, New Friends
        </ModalHeader>
        <ModalBody>
          <Input
            placeholder="Search username"
            variant="underlined"
            size="lg"
            onChange={(e) => setInputValue(e.target.value)}
            endContent={<SearchIcon />}
          />
          {seachResults?.length > 0 ? (
            <div className="friends-container">
              {seachResults
                .filter(({ username }) => username !== userInfo.username)
                .map(({ username }) => {
                  return (
                    <div
                      key={uuidv4()}
                      className={
                        selectedUsername === username
                          ? "selected-friend cursor-pointer friends-item"
                          : "cursor-pointer friends-item"
                      }
                      onClick={() => handleAddNewFriend({ username })}
                    >
                      <div>
                        <Avatar
                          // name={username[0]?.toUpperCase()}
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
                      <Spacer x={10} />
                      <MessageSVG />
                      <AddSVG />
                    </div>
                  );
                })}
            </div>
          ) : (
            inputValue && <div> No Results found !! </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" variant="flat" onPress={handleClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
