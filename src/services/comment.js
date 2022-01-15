import { API } from "../helpers/api";

export const getComments = (params) => {
  API.get("/comments", { params }).then((res) => console.log({ res }));
};

export const getCommentsByPost = (postId, params = {}) =>
  API.get(`/posts/${postId}/comments`, { params }).then((res) => res.data);
