import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import productService from "./productService";

export const getProducts = createAsyncThunk(
    "product/getProducts",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await productService.getProduct(payload);
            return response;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                error.message ||
                "Something went wrong"
            );
        }
    }
);


export const approveProducts = createAsyncThunk(
    "product/approveProduct",
    async ({ _id, data }) => {
        try {
            const response = await productService.approveProduct(_id, data);
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

const productSlice = createSlice({
    name: "product",
    initialState: {
        product: [],
        pagination: {
            page: 1,
            total: 0,
            limit: 10,
            totalPages: 1,
        },
        loading: false,
        approveLoading: false,
        error: null,
    },
    reducers: {
        resetProduct: (state) => {
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload.data
                state.pagination = {
                    page: action.payload.extras?.page,
                    total: action.payload.extras?.total,
                    limit: action.payload.extras?.limit,
                    totalPages: action.payload.extras?.totalPages,
                };
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
            .addCase(approveProducts.pending, (state) => {
                state.approveLoading = true;
            })
        .addCase(approveProducts.fulfilled, (state, action) => {
            state.approveLoading = false;
            state.message = action.payload.message;
            toast.success(state.message);
        })
        .addCase(approveProducts.rejected, (state, action) => {
            state.approveLoading = false;
            state.error = action.error.message;
            toast.error(state.error);
        })
},
});

export const { resetProduct } = productSlice.actions;
export default productSlice.reducer;