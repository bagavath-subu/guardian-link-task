import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCommentsByPost } from "../services";

const initialState = { loading: false, data: [] };

export const getCommentsAPI = createAsyncThunk(
  "getComments",
  async (postId, params) => {
    const response = await getCommentsByPost(postId, params);
    // The value we return becomes the `fulfilled` action payload
    return response;
  }
);

export const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCommentsAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCommentsAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      });
  },
});

export default commentSlice.reducer;
