import { configureStore } from "@reduxjs/toolkit";

import supplierReducer from "./slices/SupplierSlice";
import consumerReducer from "./slices/customerSlice";
import vendorReducer from "./slices/VendorSlice";
import expenseReducer from "./slices/expenseSlice";

const store = configureStore({
  reducer: {
    supplier: supplierReducer,
    consumer: consumerReducer,
    vendor: vendorReducer,
    expense: expenseReducer,
  },
});

export default store;
