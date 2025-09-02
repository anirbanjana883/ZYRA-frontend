import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    suggestedUser: null,
    profileData : null,
    following:[],
    searchData:null
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setSuggestedUserData: (state, action) => {
      state.suggestedUser = action.payload;
    },
    setProfileData: (state, action) => {
      state.profileData = action.payload;
    },
    setFollowing:(state,action)=>{
      state.following = action.payload;
    },
    toggleFollow:(state,action)=>{
      const targetUserId = action.payload;
      if(state.following.includes(targetUserId)){
        state.following = state.following.filter(id=>id!==targetUserId)
      }else{
        state.following.push(targetUserId)
      }
    },
    setSearchData:(state,action)=>{
      state.searchData = action.payload;
    },
  },
});

export const { setUserData, setSuggestedUserData ,setProfileData ,setFollowing ,toggleFollow , setSearchData} = userSlice.actions;
export default userSlice.reducer;
