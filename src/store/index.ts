import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import uiSlice from "./slices/uiSlice";
import companySlice from "./slices/companySlice";
import invoiceSlice from "./slices/invoiceSlice";
import quotationSlice from "./slices/quotationSlice";
import inventorySlice from "./slices/inventorySlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    ui: uiSlice,
    company: companySlice,
    invoice: invoiceSlice,
    quotation: quotationSlice,
    inventory: inventorySlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
