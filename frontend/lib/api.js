import axios from "axios";

const API = axios.create({
  baseURL: "https://your-backend-name.onrender.com",
});

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return API.post("/upload/", formData);
};

export const trainModels = async (target, problem_type) => {
  const formData = new FormData();
  formData.append("target", target);
  formData.append("problem_type", problem_type);

  return API.post("/train/", formData);
};