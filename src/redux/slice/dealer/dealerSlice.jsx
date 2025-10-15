import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import dealerService from "./dealerService";

export const addDealer = createAsyncThunk("dealer/addDealer", async (data) => {
  try {
    const response = await dealerService.createDealer(data);
    return response;
  } catch (error) {
    throw (
      error?.response?.data?.message || error.message || "Something went wrong"
    );
  }
});

export const getDealer = createAsyncThunk(
  "dealer/getDealer",
  async (payload) => {
    try {
      const response = await dealerService.getAllDealer(payload);
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

export const getDealerById = createAsyncThunk(
  "dealer/getDealerById",
  async (payload) => {
    try {
      const response = await dealerService.getDealerById(payload);
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

export const getDealerDropdown = createAsyncThunk(
  "dealer/getDealerDropdown",
  async () => {
    try {
      const response = await dealerService.getDealerDropdown();
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

export const updateDealer = createAsyncThunk(
  "dealer/updateDealer",
  async ({ dealerId, data }) => {
    try {
      const response = await dealerService.updateDealer(dealerId, data);
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

export const deleteDealer = createAsyncThunk(
  "dealer/deleteDealer",
  async (dealerId) => {
    try {
      const response = await dealerService.deleteDealer(dealerId);
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

const dealerSlice = createSlice({
  name: "dealer",
  initialState: {
    dealer: [],
    dealerById: null,
    dealerDrop: [],
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
    error: null,
  },
  reducers: {
    resetDealer: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addDealer.pending, (state) => {
        state.postLoading = true;
      })
      .addCase(addDealer.fulfilled, (state, action) => {
        state.postLoading = false;
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(addDealer.rejected, (state, action) => {
        state.postLoading = false;
        state.error = action.error.message;
        toast.error(state.error);
      })
      .addCase(getDealer.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDealer.fulfilled, (state, action) => {
        state.loading = false;
        state.dealer = action.payload.data;
        state.pagination = {
          page: action.payload.extras.page,
          total: action.payload.extras.total,
          limit: action.payload.extras.limit,
          totalPages: action.payload.extras.totalPages,
        };
      })
      .addCase(getDealer.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(getDealerById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDealerById.fulfilled, (state, action) => {
        state.loading = false;
        state.dealerById = action.payload.data;
      })
      .addCase(getDealerById.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(getDealerDropdown.pending, (state) => {
        state.dropLoading = true;
      })
      .addCase(getDealerDropdown.fulfilled, (state, action) => {
        state.dropLoading = false;
        state.dealerDrop = action.payload.data;
      })
      .addCase(getDealerDropdown.rejected, (state, action) => {
        state.dropLoading = false;
      })
      .addCase(updateDealer.pending, (state) => {
        state.postLoading = true;
      })
      .addCase(updateDealer.fulfilled, (state, action) => {
        state.postLoading = false;
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(updateDealer.rejected, (state, action) => {
        state.postLoading = false;
        state.error = action.error.message;
        toast.error(state.error);
      })
      .addCase(deleteDealer.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteDealer.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(deleteDealer.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.error.message;
        toast.error(state.error);
      });
  },
});

export const { resetDealer } = dealerSlice.actions;
export default dealerSlice.reducer;
