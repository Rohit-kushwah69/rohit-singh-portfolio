import axios from "axios";

const API = axios.create({
  baseURL:"https://rohit-portfolio-server.onrender.com",
  withCredentials: true, // IMPORTANT for httpOnly cookie
});

export default API;  
