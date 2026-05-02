import axios from "axios";

// ✅ YOUR REAL BACKEND URL
const API = axios.create({
  baseURL: "https://bitstack-backend.onrender.com",
});

// upload file
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return API.post("/upload/", formData);
};

// train model
export const trainModels = async (target, problem_type) => {
  const formData = new FormData();
  formData.append("target", target);
  formData.append("problem_type", problem_type);

  return API.post("/train/", formData);
};