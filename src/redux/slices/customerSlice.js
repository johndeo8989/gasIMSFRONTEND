import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

export const fetchConsumer = createAsyncThunk(
    'consumer/fetchConsumer',
    async () => {
        const response = await axios.get("http://localhost:8080/consumer/get");
        return response.data.consumer; // adjust if your API returns differently
    }
);

const consumerSlice = createSlice({
    name: 'consumer',
    initialState: {
        consumer: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchConsumer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchConsumer.fulfilled, (state, action) => {
                state.loading = false;
                state.consumer = action.payload;
            })
            .addCase(fetchConsumer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export default consumerSlice.reducer;
