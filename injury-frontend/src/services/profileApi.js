import axios from "axios";

const API_URL = "http://127.0.0.1:8000/users/profile/";

export const getUserProfile = () => {
  const token = localStorage.getItem("access");

  return axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateUserProfile = (data) => {
  const token = localStorage.getItem("access");

  return axios.put(API_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
