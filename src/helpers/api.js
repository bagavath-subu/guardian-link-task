import Axios from "axios";

const ACCESS_TOKEN = `d97d8dd88cd2c5b941eccf4bcb82d5141d934a0c2933399ab74f12c468f175d1`;
const baseURL = `https://gorest.co.in/public/v1`;
const headers = {
  "Content-Type": "application/json",
  Authorization: "Bearer " + ACCESS_TOKEN,
};
const AXIOS_CONFIG = {
  baseURL,
  headers,
};

export const API = Axios.create(AXIOS_CONFIG);
