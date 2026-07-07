import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api",
});



API.interceptors.request.use((config) => {

  const token = localStorage.getItem("access_token");


  if (token) {

    config.headers.Authorization = `Bearer ${token}`;

  }


  return config;

});




export const getDashboardData = async () => {

  const response = await API.get("/dashboard");

  return response.data;

};




export const listTasksRequest = async () => {

  const response = await API.get("/tasks");

  return response.data;

};


export const createTaskRequest = async (taskData) => {

  const response = await API.post("/tasks", taskData);

  return response.data;

};


export const updateTaskRequest = async (taskId, taskData) => {

  const response = await API.put(
    `/tasks/${taskId}`,
    taskData
  );

  return response.data;

};


export const deleteTaskRequest = async (taskId) => {

  const response = await API.delete(
    `/tasks/${taskId}`
  );

  return response.data;

};



export const listUsersRequest = async () => {

  const response = await API.get("/users");

  return response.data;

};


export default API;