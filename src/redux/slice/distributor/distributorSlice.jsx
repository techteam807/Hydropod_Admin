import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import distributorService from "./distributorService";
import { toast } from "react-toastify";

export const addDistributor = createAsyncThunk(
  "distributor/addDistributor",
  async (data) => {
    try {
      const response = await distributorService.createDistributor(data);
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

export const getDistributor = createAsyncThunk(
  "distributor/getDistributor",
  async (payload) => {
    try {
      const response = await distributorService.getAllDistributor(payload);
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

export const getDistributorById = createAsyncThunk(
  "distributor/getDistributorById",
  async (payload) => {
    try {
      const response = await distributorService.getDistributorById(payload);
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

export const getDistributorDropdown = createAsyncThunk(
  "distributor/getDistributorDropdown",
  async () => {
    try {
      const response = await distributorService.getDistributorDropdown();
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

export const updateDistributor = createAsyncThunk(
  "distributor/updateDistributor",
  async ({ distributorId, data }) => {
    try {
      const response = await distributorService.updateDistributor(
        distributorId,
        data
      );
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

export const deleteDistributor = createAsyncThunk(
  "distributor/deleteDistributor",
  async (distributorId) => {
    try {
      const response = await distributorService.deleteDistributor(
        distributorId
      );
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
export const restoreDistributor = createAsyncThunk(
  "dealer/restoreDistributor",
  async (distributorId) => {
    try {
      const response = await distributorService.restoreDistributor(
        distributorId
      );
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

const distributorSlice = createSlice({
  name: "distributor",
  initialState: {
    distributor: [],
    activeDistributors: [],
    inactiveDistributors: [],
    distributorById: null,
    distributorDrop: [],
    pagination: {
      page: 1,
      total: 0,
      limit: 10,
      totalPages: 1,
    },
    loading: false,
    postLoading: false,
    dropLoading: false,
    deleteLoading: false,
    restoreLoading: false,
    error: null,
  },
  reducers: {
    resetDistributor: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addDistributor.pending, (state) => {
        state.postLoading = true;
      })
      .addCase(addDistributor.fulfilled, (state, action) => {
        state.postLoading = false;
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(addDistributor.rejected, (state, action) => {
        state.postLoading = false;
        state.error = action.error.message;
        toast.error(state.error);
      })
      .addCase(getDistributor.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDistributor.fulfilled, (state, action) => {
        state.loading = false;

        const isActive = action.meta.arg.isActive; // ✅ detect current tab from request
        if (isActive) {
          state.activeDistributors = action.payload.data;
        } else {
          state.inactiveDistributors = action.payload.data;
        }

        state.pagination = {
          page: action.payload.extras.page,
          total: action.payload.extras.total,
          limit: action.payload.extras.limit,
          totalPages: action.payload.extras.totalPages,
        };
      })
      .addCase(getDistributor.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getDistributorById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDistributorById.fulfilled, (state, action) => {
        state.loading = false;
        state.distributorById = action.payload.data;
      })
      .addCase(getDistributorById.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(getDistributorDropdown.pending, (state) => {
        state.dropLoading = true;
      })
      .addCase(getDistributorDropdown.fulfilled, (state, action) => {
        state.dropLoading = false;
        state.distributorDrop = action.payload.data;
      })
      .addCase(getDistributorDropdown.rejected, (state, action) => {
        state.dropLoading = false;
      })
      .addCase(updateDistributor.pending, (state) => {
        state.postLoading = true;
      })
      .addCase(updateDistributor.fulfilled, (state, action) => {
        state.postLoading = false;
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(updateDistributor.rejected, (state, action) => {
        state.postLoading = false;
        state.error = action.error.message;
        toast.error(state.error);
      })
      .addCase(deleteDistributor.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteDistributor.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(deleteDistributor.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.error.message;
        toast.error(state.error);
      })
      .addCase(restoreDistributor.pending, (state) => {
        state.restoreLoading = true;
        state.error = null;
      })
      .addCase(restoreDistributor.fulfilled, (state, action) => {
        state.restoreLoading = false;
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(restoreDistributor.rejected, (state, action) => {
        state.restoreLoading = false;
        state.error = action.error.message;
        toast.error(state.error);
      });
  },
});

export const { resetDistributor } = distributorSlice.actions;
export default distributorSlice.reducer;
