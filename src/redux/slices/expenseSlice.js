import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchExpense = createAsyncThunk(
  "expense/fetchExpense",
  async () => {
    const response = await axios.get("http://localhost:8080/expenses/all");
    return response.data.expenses; // adjust if your API returns differently
  }
);

const consumerSlice = createSlice({
  name: "expense",
  initialState: {
    expense: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.expense = action.payload;
      })
      .addCase(fetchExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default consumerSlice.reducer;
