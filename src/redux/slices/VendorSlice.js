import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchVendors = createAsyncThunk(
  "vendor/fetchVendors",
  async () => {
    const response = await axios.get("http://localhost:8080/vendor/get");

    return response.data.vendors || [];
  }
);

const vendorSlice = createSlice({
  name: "vendor",
  initialState: {
    vendors: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors = action.payload;
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default vendorSlice.reducer;
