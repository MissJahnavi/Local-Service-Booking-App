import axios from "axios";


const BASE_URL =  "http://localhost:5000" 
// const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "http://localhost:5000";
console.log("API Base URL:", import.meta.env.MODE, BASE_URL);

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

export { BASE_URL };
export default api;