import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  timeout: 120000,
});

// FIXED TOKEN KEY
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Auto logout on 401
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const fetchExercises = () => {
  return API.get("exercises/");
};

export const analyzeVideo = (videoBlob, exercise = null) => {
  const formData = new FormData();
  formData.append("video", videoBlob);

  if (exercise) {
    formData.append("exercise", exercise);
  }

  return API.post("analyze/", formData);
};

export default API;