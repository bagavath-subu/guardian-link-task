import { API } from "../helpers/api";

export const getTodos = (params = {}) =>
  API.get("/todos", { params }).then((res) => res.data);

export const getTodosByUser = (userId, params = {}) =>
  API.get(`/users/${userId}/todos`, { params }).then((res) => res.data);

export const postTodosByUser = (userId, payload = {}) =>
  API.post(`/users/${userId}/todos`, payload).then((res) => res.data);

export const updateTodo = (id, payload = {}) =>
  API.put(`/todos/${id}`, payload).then((res) => res.data);

export const deleteTodo = (id) =>
  API.delete(`/todos/${id}`).then((res) => res.data);
