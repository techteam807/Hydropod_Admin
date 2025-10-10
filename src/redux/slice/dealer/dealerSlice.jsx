import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import dealerService from "./dealerService";

export const addDealer = createAsyncThunk(
    "Dealer/addDealer",
    async (data, thunkAPI) => {
        try {
            return await dealerService.createDealer(data);
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const getDealer = createAsyncThunk(
    "Dealer/getDealer",
    async (payload, thunkAPI) => {
        try {
            return await dealerService.getAllDealer(payload);
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const getDealerById = createAsyncThunk(
    "Dealer/getDealerById",
    async (payload, thunkAPI) => {
        try {
            return await dealerService.getDealerById(payload);
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const getDealerDropdown = createAsyncThunk(
    "Dealer/getDealerDropdown",
    async (thunkAPI) => {
        try {
            return await dealerService.getDealerDropdown();
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const updateDealer = createAsyncThunk(
    "distributor/updateDealer",
    async ({ dealerId, data }, thunkAPI) => {
        try {
            return await dealerService.updateDealer(dealerId, data);
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const deleteDealer = createAsyncThunk(
    "distributor/deleteDealer",
    async (dealerId, thunkAPI) => {
        try {
            return await dealerService.deleteDealer(dealerId);
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

const dealerSlice = createSlice({
    name: "Dealer",
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
                state.message = action.payload?.message;
                toast.success(state.message);
            })
            .addCase(addDealer.rejected, (state, action) => {
                state.postLoading = false;
                // toast.error(action.payload.error);
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
                // toast.error(action.payload);
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
                // toast.error(action.payload);
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
                // toast.error(action.payload);
            })
            .addCase(updateDealer.pending, (state) => {
                state.postLoading = true;
            })
            .addCase(updateDealer.fulfilled, (state, action) => {
                state.postLoading = false;
                state.message = action.payload?.message;
                toast.success(state.message);
            })
            .addCase(updateDealer.rejected, (state, action) => {
                state.postLoading = false;
                // toast.error(action.payload.error);
            })
            .addCase(deleteDealer.pending, (state) => {
                state.deleteLoading = true;
                state.error = null;
            })
            .addCase(deleteDealer.fulfilled, (state, action) => {
                state.deleteLoading = false;
                state.dealer = state.dealer.filter(
                    (item) => item._id !== action.meta.arg
                );
                toast.success(action.payload?.message);
            })
            .addCase(deleteDealer.rejected, (state, action) => {
                state.deleteLoading = false;
                state.error = action.payload;
                // toast.error(action.payload);
            });
    },
});

export const { resetDealer } = dealerSlice.actions;
export default dealerSlice.reducer;