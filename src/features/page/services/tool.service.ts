import axios from "../../../api/axios";

export const searchToolsApi =
  (
    query: string
  ) => {
    return axios.get(
      `/tools/search/?search=${query}`
    );
  };