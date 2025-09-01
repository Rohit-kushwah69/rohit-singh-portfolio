import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://rohit-portfolio-server.onrender.com",
  withCredentials: true, // IMPORTANT for httpOnly cookie
});

export default API;  
