import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    selectedUser: null,
    messages: [],
    prevChatUsers: null,
  },
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
      state.messages = [];
      localStorage.setItem("selectedUser", JSON.stringify(action.payload));
    },
    setMessages: (state, action) => {
      state.messages = Array.isArray(action.payload)
        ? action.payload.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          )
        : [];
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
      state.messages.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    },

    setPrevChatUsers: (state, action) => {
      state.prevChatUsers = action.payload;
    },
    updatePrevChatUser: (state, action) => {
      const { userId, lastMessage, lastMessageTime } = action.payload;
      if (!state.prevChatUsers) return;

      const userIndex = state.prevChatUsers.findIndex((u) => u._id === userId);
      if (userIndex !== -1) {
        if (lastMessage)
          state.prevChatUsers[userIndex].lastMessage = lastMessage;
        if (lastMessageTime)
          state.prevChatUsers[userIndex].lastMessageTime = lastMessageTime;
      } else {
        //  If not found, add new entry
        state.prevChatUsers.unshift({
          _id: userId,
          lastMessage: lastMessage || "",
          lastMessageTime: lastMessageTime || new Date().toISOString(),
        });
      }
    },
    updateMessageStatus: (state, action) => {
      const { messageId, status } = action.payload;
      const msgIndex = state.messages.findIndex((m) => m._id === messageId);
      if (msgIndex !== -1) state.messages[msgIndex].status = status;
    },
  },
});

export const {
  setSelectedUser,
  setMessages,
  addMessage,
  setPrevChatUsers,
  updatePrevChatUser,
  updateMessageStatus,
} = messageSlice.actions;

export default messageSlice.reducer;
