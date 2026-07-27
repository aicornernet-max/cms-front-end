import axios from "./axios";

export interface LoginActivityQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: "SUCCESS" | "FAILED";
  action?: "LOGIN" | "LOGOUT";
  date?: "today" | "yesterday" | "last7days" | "last30days";
  from?: string;
  to?: string;
}

export const getLoginActivities = (
  params: LoginActivityQuery = {}
) => {
  return axios.get("/v1/admin/login-activities", {
    params,
  });
};