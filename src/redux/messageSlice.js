import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    selectedUser: null,
    messages: [],
    prevChatUsers:null
  },
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
      localStorage.setItem("selectedUser", JSON.stringify(action.payload));
    },
    setMessages: (state, action) => {
      state.messages = Array.isArray(action.payload) ? action.payload : [];
    },
    setPrevChatUsers: (state, action) => {
      state.prevChatUsers = action.payload
    },
  },
});

export const { setSelectedUser, setMessages ,setPrevChatUsers} = messageSlice.actions;
export default messageSlice.reducer;
