import axios from "./axios";

export const getMe = () => axios.get("/auth/me");
export const login = (data: {
  email: string;
  password: string;
}) => axios.post("/auth/login", data);

export const logout = () => axios.post("/auth/logout");