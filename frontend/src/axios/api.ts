import axios from "axios";

const defaultHeader = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

// Construct Base URL from Environment Variable
const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { ...defaultHeader },
});
