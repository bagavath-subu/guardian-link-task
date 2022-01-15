import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../reducers/user";
import todoReducer from "../reducers/todo";
import postReducer from "../reducers/post";
import commentReducer from "../reducers/comment";

const reducers = {
  user: userReducer,
  todo: todoReducer,
  post: postReducer,
  comment: commentReducer,
};

export const store = configureStore({
  reducer: reducers,
});
