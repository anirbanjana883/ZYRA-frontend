import { createSlice } from "@reduxjs/toolkit";

const loopSlice = createSlice({
  name: "loop",
  initialState: {
    loopData: [], // all loops
  },
  reducers: {
    // set all loops (used when fetching)
    setLoopData: (state, action) => {
      state.loopData = action.payload;
    },

    // add a new loop (after upload)
    addLoop: (state, action) => {
      state.loopData.unshift(action.payload); // add to start
    },

    // update likes for a specific loop
    updateLoopLikes: (state, action) => {
      const { loopId, likes } = action.payload;
      const loop = state.loopData.find((l) => l._id === loopId);
      if (loop) loop.likes = likes;
    },

    // add comment to a loop
    addLoopComment: (state, action) => {
      const { loopId, comments } = action.payload;
      const loop = state.loopData.find((l) => l._id === loopId);
      if (loop) loop.comments = comments;
    },

    // add reply to a comment
    addLoopReply: (state, action) => {
      const { loopId, commentId, replies } = action.payload;
      const loop = state.loopData.find((l) => l._id === loopId);
      if (loop) {
        const comment = loop.comments.find((c) => c._id === commentId);
        if (comment) comment.replies = replies;
      }
    },

    // delete comment
    deleteLoopComment: (state, action) => {
      const { loopId, commentId } = action.payload;
      const loop = state.loopData.find((l) => l._id === loopId);
      if (loop) {
        loop.comments = loop.comments.filter((c) => c._id !== commentId);
      }
    },

    // delete reply
    deleteLoopReply: (state, action) => {
      const { loopId, commentId, replyId } = action.payload;
      const loop = state.loopData.find((l) => l._id === loopId);
      if (loop) {
        const comment = loop.comments.find((c) => c._id === commentId);
        if (comment) {
          comment.replies = comment.replies.filter((r) => r._id !== replyId);
        }
      }
    },
  },
});

export const {
  setLoopData,
  addLoop,
  updateLoopLikes,
  addLoopComment,
  addLoopReply,
  deleteLoopComment,
  deleteLoopReply,
} = loopSlice.actions;

export default loopSlice.reducer;
