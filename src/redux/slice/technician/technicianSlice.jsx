import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import technicianService from "./technicianService";
import { toast } from "react-toastify";

export const addTechnician = createAsyncThunk(
  "technician/addTechnician",
  async (data) => {
    try {
      const response = await technicianService.createTechnician(data);
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

export const getTechnician = createAsyncThunk(
  "technician/getTechnician",
  async (payload) => {
    try {
      const response = await technicianService.getAllTechnician(payload);
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

export const getTechnicianById = createAsyncThunk(
  "technician/getTechnicianById",
  async (technicianId) => {
    try {
      const payload = { technicianId };
      const response = await technicianService.getAllTechnician(payload);
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

export const getCount = createAsyncThunk("technician/getCount", async () => {
  try {
    const response = await technicianService.getCount();
    return response;
  } catch (error) {
    throw (
      error?.response?.data?.message || error.message || "Something went wrong"
    );
  }
});

export const updateTechnician = createAsyncThunk(
  "technician/updateTechnician",
  async ({ technicianId, data }) => {
    try {
      const response = await technicianService.updateTechnician(
        technicianId,
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

export const deleteTechnician = createAsyncThunk(
  "technician/deleteTechnician",
  async (technicianId) => {
    try {
      const response = await technicianService.deleteTechnician(technicianId);
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
export const restoreTechnician = createAsyncThunk(
  "Technician/restoreTechnician",
  async (technicianId) => {
    try {
      const response = await technicianService.restoreTechnician(technicianId);
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

const technicianSlice = createSlice({
  name: "technician",
  initialState: {
    technician: [],
    singleTechnician: null,
    count: [],
    pagination: {
      page: 1,
      total: 0,
      limit: 10,
      totalPages: 1,
    },
    loading: false,
    postLoading: false,
    deleteLoading: false,
    restoreLoading: false,
    error: null,
  },
  reducers: {
    resetTechnician: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addTechnician.pending, (state) => {
        state.postLoading = true;
      })
      .addCase(addTechnician.fulfilled, (state, action) => {
        state.postLoading = false;
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(addTechnician.rejected, (state, action) => {
        state.postLoading = false;
        state.error = action.error.message;
        toast.error(state.error);
      })
      .addCase(getTechnician.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTechnician.fulfilled, (state, action) => {
        state.loading = false;
        state.technician = action.payload.data;
        state.pagination = {
          page: action.payload.extras.page,
          total: action.payload.extras.total,
          limit: action.payload.extras.limit,
          totalPages: action.payload.extras.totalPages,
        };
      })
      .addCase(getTechnician.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(getTechnicianById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTechnicianById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleTechnician = action.payload.data[0];
      })
      .addCase(getTechnicianById.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(getCount.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCount.fulfilled, (state, action) => {
        state.loading = false;
        state.count = action.payload.data;
      })
      .addCase(getCount.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(updateTechnician.pending, (state) => {
        state.postLoading = true;
      })
      .addCase(updateTechnician.fulfilled, (state, action) => {
        state.postLoading = false;
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(updateTechnician.rejected, (state, action) => {
        state.postLoading = false;
        state.error = action.error.message;
        toast.error(state.error);
      })
      .addCase(deleteTechnician.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteTechnician.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(deleteTechnician.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.error.message;
        toast.error(state.error);
      })
       .addCase(restoreTechnician.pending, (state) => {
              state.restoreLoading = true;
              state.error = null;
            })    
            .addCase(restoreTechnician.fulfilled, (state, action) => {
              state.restoreLoading = false;
              state.message = action.payload.message;
              toast.success(state.message);
            })
            .addCase(restoreTechnician.rejected, (state, action) => {
              state.restoreLoading = false;
              state.error = action.error.message;
              toast.error(state.error);
            });
  },
});

export const { resetTechnician } = technicianSlice.actions;
export default technicianSlice.reducer;
