import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import bannerService from "./bannerService";
import { toast } from "react-toastify";

export const addBanner = createAsyncThunk("banner/addBanner", async (data) => {
  try {
    const response = await bannerService.createBanner(data);
    return response;
  } catch (error) {
    throw (
      error?.response?.data?.message || error.message || "Something went wrong"
    );
  }
});

export const getBanners = createAsyncThunk("banner/getBanners", async () => {
  try {
    const response = await bannerService.getBanners();
    return response;
  } catch (error) {
    throw (
      error?.response?.data?.message || error.message || "Something went wrong"
    );
  }
});

export const editBanner = createAsyncThunk(
  "banner/editBanner",
  async ({ bannerId, data }) => {
    try {
      const response = await bannerService.updateBanner(bannerId, data);
      return response;
    } catch (error) {
      throw (
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong"
      );
    }
  }
);

export const deleteBanner = createAsyncThunk(
  "banner/deleteBanner",
  async (bannerId) => {
    try {
      const response = await bannerService.deleteBanner(bannerId);
      return response;
    } catch (error) {
      throw (
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong"
      );
    }
  }
);

const bannerSlice = createSlice({
  name: "banner",
  initialState: {
    banner: [],
    loading: false,
    postLoading: false,
    deleteLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // create
      .addCase(addBanner.pending, (state) => {
        state.postLoading = true;
      })
      .addCase(addBanner.fulfilled, (state, action) => {
        state.postLoading = false;
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(addBanner.rejected, (state, action) => {
        state.postLoading = false;
        state.error = action.error.message;
        toast.error(state.error);
      })
      //   get
      .addCase(getBanners.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.banner = action.payload.data;
        state.message = action.payload.message;
        // toast.success(state.message);
      })
      .addCase(getBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        toast.error(state.error);
      })
      //   update
      .addCase(editBanner.pending, (state) => {
        state.postLoading = true;
      })
      .addCase(editBanner.fulfilled, (state, action) => {
        state.postLoading = false;
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(editBanner.rejected, (state, action) => {
        state.postLoading = false;
        state.error = action.error.message;
        toast.error(state.error);
      })
      // delete
      .addCase(deleteBanner.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(deleteBanner.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.error.message;
        toast.error(state.error);
      });
  },
});

export default bannerSlice.reducer;