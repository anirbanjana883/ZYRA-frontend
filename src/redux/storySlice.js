import { createSlice } from "@reduxjs/toolkit";

const storySlice = createSlice({
  name: "story",
  initialState: {
    storyData: [],       
    storyList: [],       
    currentUserStory: null, 
  },
  reducers: {
    setStoryData: (state, action) => {
      state.storyData = action.payload;
    },
    setStoryList: (state, action) => {
      state.storyList = action.payload;
    },
    setCurrentUserStory: (state, action) => {
      state.currentUserStory = action.payload;
    },
    setDeleteStory: (state, action) => {
      // Remove the deleted story from storyList
      state.storyList = state.storyList.filter(
        (story) => story._id !== action.payload
      );

      // If current user's story is deleted, clear it
      if (state.currentUserStory?._id === action.payload) {
        state.currentUserStory = null;
      }
    },
  },
});

export const { 
  setStoryData, 
  setStoryList, 
  setCurrentUserStory,
  setDeleteStory   
} = storySlice.actions;

export default storySlice.reducer;
