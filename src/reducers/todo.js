import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTodosByUser } from "../services";

const initialState = { loading: false, data: [] };

export const getTodosAPI = createAsyncThunk(
  "getTodos",
  async (userId, params) => {
    const response = await getTodosByUser(userId, params);
    // The value we return becomes the `fulfilled` action payload
    return response;
  }
);

export const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTodosAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTodosAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      });
  },
});

export default todoSlice.reducer;
