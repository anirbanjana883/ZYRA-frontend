import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    selectedUser: null,
    messages: [],
  },
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
      localStorage.setItem("selectedUser", JSON.stringify(action.payload));
    },
    setMessages: (state, action) => {
      state.messages = Array.isArray(action.payload) ? action.payload : [];
    },
  },
});

export const { setSelectedUser, setMessages } = messageSlice.actions;
export default messageSlice.reducer;
