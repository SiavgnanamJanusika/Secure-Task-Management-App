import axiosClient from "./axiosClient";

export const registerRequest = (payload) =>
  axiosClient.post("/auth/register", payload).then((res) => res.data);

export const loginRequest = (payload) =>
  axiosClient.post("/auth/login-json", payload).then((res) => res.data);

export const fetchCurrentUser = () =>
  axiosClient.get("/auth/me").then((res) => res.data);
