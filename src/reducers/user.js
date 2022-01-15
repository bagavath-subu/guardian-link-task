import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUsers } from "../services";

const initialState = { currentUser: null, loading: false, data: [] };

export const getUsersAPI = createAsyncThunk("getUsers", async (params) => {
  const response = await getUsers(params);
  // The value we return becomes the `fulfilled` action payload
  return response;
});

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsersAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUsersAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      });
  },
});

export const { setCurrentUser } = userSlice.actions;

export default userSlice.reducer;
