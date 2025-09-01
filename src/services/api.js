import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://rohit-portfolio-server.onrender.com",
  withCredentials: true, // IMPORTANT for httpOnly cookie
});

// Optional: attach token from localStorage for mobile / cross-domain
const token = localStorage.getItem("token");
if (token) {
  API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default API;  
