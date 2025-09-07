import { createSlice } from "@reduxjs/toolkit";

const loopSlice = createSlice({
  name: "loop",
  initialState: {
    loopData: [], // stores all loops in the app (feed)
  },
  reducers: {
    //  Set all loops at once (used when fetching loops from backend)
    setLoopData: (state, action) => {
      state.loopData = action.payload;
    },

    //  Add a new loop to the start of the array (after upload)
    addLoop: (state, action) => {
      state.loopData.unshift(action.payload);
    },

    //  Update likes for a specific loop
    updateLoopLikes: (state, action) => {
      const { loopId, likes } = action.payload;
      const loop = state.loopData.find((l) => l._id === loopId);
      if (loop) loop.likes = likes;
    },

    //  Replace comments array for a specific loop (after adding comment)
    addLoopComment: (state, action) => {
      const { loopId, comments } = action.payload;
      const loop = state.loopData.find((l) => l._id === loopId);
      if (loop) loop.comments = comments;
    },

    //  Replace replies array for a specific comment in a loop
    addLoopReply: (state, action) => {
      const { loopId, commentId, replies } = action.payload;
      const loop = state.loopData.find((l) => l._id === loopId);
      if (loop) {
        const comment = loop.comments.find((c) => c._id === commentId);
        if (comment) comment.replies = replies;
      }
    },

    //  Delete a comment from a loop (used when user removes their comment)
    deleteLoopComment: (state, action) => {
      const { loopId, commentId } = action.payload;
      const loop = state.loopData.find((l) => l._id === loopId);
      if (loop) {
        loop.comments = loop.comments.filter((c) => c._id !== commentId);
      }
    },

    //  Delete a reply from a comment (used when user removes their reply)
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

    //  Delete an entire loop from the state (after backend deletion)
    deleteLoopFromState: (state, action) => {
      state.loopData = state.loopData.filter(
        (loop) => loop._id !== action.payload
      );
    },
  },
});

// Exporting all reducer functions (actions)
export const {
  setLoopData,
  addLoop,
  updateLoopLikes,
  addLoopComment,
  addLoopReply,
  deleteLoopComment,
  deleteLoopReply,
  deleteLoopFromState
} = loopSlice.actions;

// Exporting the reducer to add into the store
export default loopSlice.reducer;
