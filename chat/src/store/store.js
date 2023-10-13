import { configureStore } from "@reduxjs/toolkit";
import ChatSlice from "./counterSlice";

export default configureStore({
  reducer: {
    chat: ChatSlice,
  },
});
