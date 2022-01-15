import { API } from "../helpers/api";

export const getPosts = (params = {}) =>
  API.get("/posts", { params }).then((res) => res.data);

export const getPostsByUser = (userId, params = {}) =>
  API.get(`/users/${userId}/posts`, { params }).then((res) => res.data);

export const postPostsByUser = (userId, payload = {}) =>
  API.post(`/users/${userId}/posts`, payload).then((res) => res.data);

export const updatePost = (id, payload = {}) =>
  API.put(`/posts/${id}`, payload).then((res) => res.data);

export const deletePost = (id) =>
  API.delete(`/posts/${id}`).then((res) => res.data);
