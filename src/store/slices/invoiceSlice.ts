import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Invoice } from "@/types";

// --- MOCK DATA ---

export const defaultTerms = `1. Payment is due within 30 days of the invoice date.
2. Late payments are subject to a 1.5% monthly interest charge.
3. Please make all checks payable to Your Company Name.`;

export const mockInvoices: Invoice[] = [
    {
        id: 'inv-2024-001', customerName: 'Tech Solutions', customerAddress: '123 Tech Avenue, Silicon Valley, CA 94043', date: '2024-07-29', dueDate: '2024-08-28', status: 'Paid',
        items: [{ id: '1', description: 'Server Setup & Configuration', quantity: 1, unitPrice: 2500, sku: 'HW-SRV-001' }],
        subtotal: 2500, vat: 187.5, total: 2687.5, terms: defaultTerms, quotationId: 'q-2024-001',
        template: 'classic', accentColor: 'teal',
    },
    {
        id: 'inv-2024-002', customerName: 'Global Corp', customerAddress: '456 Business Blvd, New York, NY 10001', date: '2024-07-26', dueDate: '2024-08-25', status: 'Sent',
        items: [{ id: '1', description: 'Network Security Audit', quantity: 1, unitPrice: 4000, sku: '' }],
        subtotal: 4000, vat: 300, total: 4300, terms: defaultTerms, quotationId: 'q-2024-002',
        template: 'modern', accentColor: 'blue',
    },
    {
        id: 'inv-2024-003', customerName: 'Innovate Inc.', customerAddress: '789 Innovation Drive, Austin, TX 78701', date: '2024-06-15', dueDate: '2024-07-15', status: 'Overdue',
        items: [{ id: '1', description: 'Cloud Migration Service', quantity: 1, unitPrice: 6000, sku: '' }],
        subtotal: 6000, vat: 450, total: 6450, terms: defaultTerms,
        template: 'minimalist', accentColor: 'slate',
    },
];
// --- END MOCK DATA ---

interface InvoiceState {
    invoices: Invoice[];
    isLoading: boolean;
    error: string | null;
}

const initialState: InvoiceState = {
    invoices: [...mockInvoices],
    isLoading: false,
    error: null,
};
const invoiceSlice = createSlice({
    name: "invoice",
    initialState,
    reducers: {
        setInvoices: (state, action: PayloadAction<Invoice[]>) => {
            state.invoices = action.payload;
            state.error = null;
        },
        updateInvoiceStatus: (state, action: PayloadAction<{ invoiceId: string; status: Invoice['status'] }>) => {
            const { invoiceId, status } = action.payload;
            const invoiceIndex = state.invoices.findIndex(inv => inv.id === invoiceId);
            if (invoiceIndex !== -1) {
                state.invoices[invoiceIndex].status = status;
            }
        },
        setInvoiceToCreate: (state, action: PayloadAction<Partial<Invoice> | null>) => {
            state.invoices = action.payload ? [...state.invoices, action.payload as Invoice] : state.invoices;
        },
    },
});
export const { setInvoices, updateInvoiceStatus, setInvoiceToCreate } = invoiceSlice.actions;
export default invoiceSlice.reducer;

