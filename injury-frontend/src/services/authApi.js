import axios from "axios";

const authAPI = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 10000,
});

export const registerUser = (data) =>
  authAPI.post("/users/register/", data);

export const loginUser = (data) =>
  authAPI.post("/users/login/", data);

export const logoutUser = () => {
  localStorage.removeItem("token");
};


export default authAPI;
