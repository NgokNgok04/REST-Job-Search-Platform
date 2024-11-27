import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  timeout: 3000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default client;
