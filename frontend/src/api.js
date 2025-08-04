import axios from "axios";

// in production, there's no localhost so we have to make this dynamic
export const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api";

export const IMAGE_BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5000" : "";


const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
