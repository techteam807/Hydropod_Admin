import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import distributorService from "./distributorService";
import { toast } from "react-toastify";

export const addDistributor = createAsyncThunk(
    "distributor/addDistributor",
    async (data, thunkAPI) => {
        try {
            return await distributorService.createDistributor(data);
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const getDistributor = createAsyncThunk(
    "distributor/getDistributor",
    async (payload, thunkAPI) => {
        try {
            return await distributorService.getAllDistributor(payload);
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const getDistributorById = createAsyncThunk(
    "distributor/getDistributorById",
    async (payload, thunkAPI) => {
        try {
            return await distributorService.getDistributorById(payload);
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const getDistributorDropdown = createAsyncThunk(
    "distributor/getDistributorDropdown",
    async (thunkAPI) => {
        try {
            return await distributorService.getDistributorDropdown();
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const updateDistributor = createAsyncThunk(
    "distributor/updateDistributor",
    async ({ distributorId, data }, thunkAPI) => {
        try {
            return await distributorService.updateDistributor(distributorId, data);
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const deleteDistributor = createAsyncThunk(
    "distributor/deleteDistributor",
    async (distributorId, thunkAPI) => {
        try {
            return await distributorService.deleteDistributor(distributorId);
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);


const distributorSlice = createSlice({
    name: "distributor",
    initialState: {
        distributor: [],
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
                // toast.error(state.error);
            })
            .addCase(getDistributor.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDistributor.fulfilled, (state, action) => {
                state.loading = false;
                state.distributor = action.payload.data;
                state.pagination = {
                    page: action.payload.extras.page,
                    total: action.payload.extras.total,
                    limit: action.payload.extras.limit,
                    totalPages: action.payload.extras.totalPages,
                };
            })
            .addCase(getDistributor.rejected, (state, action) => {
                state.loading = false;
                // toast.error(action.payload);
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
                // toast.error(action.payload);
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
                // toast.error(action.payload);
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
                // toast.error(action.payload.error);
            })
            .addCase(deleteDistributor.pending, (state) => {
                state.deleteLoading = true;
                state.error = null;
            })
            .addCase(deleteDistributor.fulfilled, (state, action) => {
                state.deleteLoading = false;
                // state.distributor = state.distributor.filter(
                //     (item) => item._id !== action.meta.arg
                // );
                state.message = action.payload.message;
                 toast.success(state.message);
            })
            .addCase(deleteDistributor.rejected, (state, action) => {
                state.deleteLoading = false;
                state.error = action.payload;
                // toast.error(action.payload);
            });
    },
});

export const { resetDistributor } = distributorSlice.actions;
export default distributorSlice.reducer;