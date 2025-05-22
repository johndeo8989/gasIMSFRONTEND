import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from 'axios';

export const fetchSuppliers = createAsyncThunk(
    'seller/fetchSellers',
    async () => {
        const response = await axios.get("http://localhost:8080/supplier/get");

        return response.data.suppliers;
    }
)

const supplierSlice = createSlice({
    name: 'supplier',
    initialState: {
        supplier: [],
        loading: false,
        error: null,
    }
    ,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchSuppliers.pending, (state) => {
            state.loading = true,
                state.error = null
        }).addCase(fetchSuppliers.fulfilled, (state, action) => {
            state.loading = false;
            state.supplier = action.payload;
        }).addCase(fetchSuppliers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message
        })
    }
})

export default supplierSlice.reducer