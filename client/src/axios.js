import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3001/api",
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

export default instance;
