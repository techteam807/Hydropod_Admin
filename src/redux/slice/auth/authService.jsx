import api from "../../axiosconfig";

export const login = async (credentials) => {
  const res = await api.post(`auth/loginAdmin`, credentials);
  return res.data;
};

export const logout = async () => {
  return Promise.resolve();
};
