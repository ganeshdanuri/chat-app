// Redux Toolkit allows us to write "mutating" logic in reducers. It
// doesn't actually mutate the state because it uses the Immer library,
// which detects changes to a "draft state" and produces a brand new
// immutable state based off those changes.
// Also, no return statement is required from these functions.

import { createSlice } from "@reduxjs/toolkit";

export const ChatSlice = createSlice({
  name: "chat",
  initialState: {
    selectedChat: null,
    chatData: [],
  },
  reducers: {
    setSelectedChat: (state, data) => {
      state.selectedChat = data.payload;
    },
    setChatData: (state, data) => {
      state.chatData = data.payload;
    },
    updateChatData: (state, data) => {
      const { chatData } = state;
      const sender = data.payload.sender || "";
      if (sender && chatData.length) {
        const updateChat = chatData.map((eachChat) => {
          if (eachChat.name === sender) {
            return { ...eachChat, chats: [...eachChat.chats, data.payload] };
          }
          return eachChat;
        });
        state.chatData = updateChat;
      } else {
        state.chatData = [...chatData, { name: sender, chats: [data.payload] }];
      }
    },
    updateSelectedChatData: (state, data) => {
      const { selectedChat } = state;
      state.selectedChat = {
        ...selectedChat,
        chats: [...(selectedChat?.chats || []), data.payload],
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setSelectedChat,
  setChatData,
  updateChatData,
  updateSelectedChatData,
} = ChatSlice.actions;

export default ChatSlice.reducer;
