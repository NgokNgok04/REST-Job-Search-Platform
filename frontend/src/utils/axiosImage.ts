import axios from "axios";

const clientFormData = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  timeout: 3000,
  withCredentials: true,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export default clientFormData;
