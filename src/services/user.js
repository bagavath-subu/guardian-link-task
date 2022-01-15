import { API } from "../helpers/api";

export const getUsers = (params) =>
  API.get("/users", { params }).then((res) => res.data);

export const createUser = (payload) =>
  API.post("/users", payload).then((res) => res.data);
