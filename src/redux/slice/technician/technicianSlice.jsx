import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import technicianService from "./technicianService";
import { toast } from "react-toastify";

export const addTechnician = createAsyncThunk(
  "technician/addTechnician",
  async (data, thunkAPI) => {
    try {
      return await technicianService.createTechnician(data);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const getTechnician = createAsyncThunk(
  "technician/getTechnician",
  async (payload, thunkAPI) => {
    try {
      return await technicianService.getAllTechnician(payload);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const getTechnicianById = createAsyncThunk(
  "technician/getTechnicianById",
  async (technicianId, thunkAPI) => {
    try {
      const payload = { technicianId };
      return await technicianService.getAllTechnician(payload);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const getCount = createAsyncThunk("technician/getCount", async () => {
  try {
    return await technicianService.getCount();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const updateTechnician = createAsyncThunk(
  "technician/updateTechnician",
  async ({ technicianId, data }, thunkAPI) => {
    try {
      return await technicianService.updateTechnician(technicianId, data);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const deleteTechnician = createAsyncThunk(
  "technician/deleteTechnician",
  async (technicianId, thunkAPI) => {
    try {
      return await technicianService.deleteTechnician(technicianId);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
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
        // toast.error(action.payload.error);
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
        // toast.error(action.payload);
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
        // toast.error(action.payload);
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
        // toast.error(action.payload);
      })
      .addCase(updateTechnician.pending, (state) => {
        state.postLoading = true;
      })
      .addCase(updateTechnician.fulfilled, (state, action) => {
        state.postLoading = false;
        state.message = action.payload.message;
        // state.singleTechnician = action.payload?.data;
        toast.success(state.message);
      })
      .addCase(updateTechnician.rejected, (state, action) => {
        state.postLoading = false;
        // toast.error(action.payload.error);
      })
      .addCase(deleteTechnician.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteTechnician.fulfilled, (state, action) => {
        state.deleteLoading = false;
        // state.technician = state.technician.filter(
        //   (item) => item._id !== action.meta.arg
        // );
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(deleteTechnician.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
        // toast.error(action.payload);
      });
  },
});

export const { resetTechnician } = technicianSlice.actions;
export default technicianSlice.reducer;