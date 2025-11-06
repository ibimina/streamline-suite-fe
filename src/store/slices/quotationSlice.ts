import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {  Quotation } from "../../types";
// --- MOCK DATA ---
export const defaultTerms = `1. All prices are exclusive of applicable taxes.
2. This quotation is valid for 30 days from the date of issue.
3. Payment terms: 50% advance, 50% upon completion.`;

export const mockQuotations: Quotation[] = [
    {
        id: 'q-2024-001', customerName: 'Tech Solutions', customerAddress: '123 Tech Avenue, Silicon Valley, CA 94043', date: '2024-07-28', status: 'Accepted',
        items: [{ id: '1', description: 'Dell PowerEdge R750 Server', quantity: 1, sellingPricePercentage: 25, costPrice: 3500, unitPrice: 4375, sku: 'HW-SRV-001' }],
        vatRate: 7.5, whtRate: 5, subtotal: 4375, vat: 328.13, total: 4703.13, terms: defaultTerms,
        template: 'classic', accentColor: 'teal',
    },
    {
        id: 'q-2024-002', customerName: 'Global Corp', customerAddress: '456 Business Blvd, New York, NY 10001', date: '2024-07-25', status: 'Sent',
        items: [{ id: '1', description: 'Network Security Audit', quantity: 1, sellingPricePercentage: 14.28, costPrice: 3500, unitPrice: 4000, sku: '' }],
        vatRate: 7.5, whtRate: 5, subtotal: 4000, vat: 300, total: 4300, terms: defaultTerms,
        template: 'modern', accentColor: 'blue',
    },
];
// --- END MOCK DATA ---

interface QuotationState {
  quotations: Quotation[];
  isLoading: boolean;
  error: string | null;
}

const initialState: QuotationState = {
  quotations: [...mockQuotations],
  isLoading: false,
  error: null,
};
const quotationSlice = createSlice({
  name: "quotation",
  initialState,
  reducers: {
    setQuotations: (state, action: PayloadAction<Quotation[]>) => {
      state.quotations = action.payload;
      state.error = null;
    },
    addQuotation: (state, action: PayloadAction<Quotation>) => {
      state.quotations.push(action.payload);
      state.error = null;
    },
    updateQuotation: (state, action: PayloadAction<Quotation>) => {
      const index = state.quotations.findIndex(
        (q) => q.id === action.payload.id
      );
      if (index !== -1) {
        state.quotations[index] = action.payload;
        state.error = null;
      }
    },
    deleteQuotation: (state, action: PayloadAction<string>) => {
      state.quotations = state.quotations.filter(
        (q) => q.id !== action.payload
      );
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

  },
});
export const {
  setQuotations,
  addQuotation,
  updateQuotation,
  deleteQuotation,
  setLoading,
  setError,
} = quotationSlice.actions;
export default quotationSlice.reducer;
