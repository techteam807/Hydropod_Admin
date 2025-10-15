import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authService from "../auth/authService";
import { toast } from "react-toastify";

export const loginUser = createAsyncThunk("auth/login", async (credentials) => {
  try {
    const response = await authService.login(credentials);
    return response;
  } catch (error) {
    throw (
      error?.response?.data?.message || error.message || "Something went wrong"
    );
  }
});

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
  return true;
});

const initialState = {
  user: null,
  token: null,
  companyId: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuth: (state) => {
      state.user = null;
      state.token = null;
      state.companyId = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        toast.error(state.error);
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

export const { resetAuth } = authSlice.actions;
export default authSlice.reducer;
