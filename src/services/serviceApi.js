import axios from "axios";

const API_URL = "http://localhost:5000/api/services";

export const applyService = (formData, token) => {
  return axios.post(`${API_URL}/apply`, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getMyApplications = (token) => {
  return axios.get(`${API_URL}/my-applications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
