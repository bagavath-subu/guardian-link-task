import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getPostsByUser } from "../services";

const initialState = { loading: false, data: [] };

export const getPostsAPI = createAsyncThunk(
  "getPosts",
  async (userId, params) => {
    const response = await getPostsByUser(userId, params);
    // The value we return becomes the `fulfilled` action payload
    return response;
  }
);

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPostsAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPostsAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      });
  },
});

export default postSlice.reducer;
