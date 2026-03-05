// Export the base API for store configuration
export { baseApi } from './baseApi'

// Export auth API and hooks
export {
  authApi,
  useLoginMutation,
  useCreateAccountMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
} from './authApi'

// Export dashboard API and hooks
export {
  dashboardApi,
  useGetDashboardStatsQuery,
  useLazyGetDashboardStatsQuery,
} from './dashboardApi'

// Export customer API and hooks
export {
  customerApi,
  useGetCustomersQuery,
  useLazyGetCustomersQuery,
  useGetCustomerByIdQuery,
  useLazyGetCustomerByIdQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} from './customerApi'

// Export product API and hooks
export {
  productApi,
  useGetProductsQuery,
  useLazyGetProductsQuery,
  useGetProductByIdQuery,
  useLazyGetProductByIdQuery,
  useGetProductStatsQuery,
  useGetLowStockProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from './productApi'

// Export supplier API and hooks
export {
  supplierApi,
  useGetSuppliersQuery,
  useLazyGetSuppliersQuery,
  useGetSupplierByIdQuery,
  useLazyGetSupplierByIdQuery,
  useGetSupplierStatsQuery,
  useGetActiveSuppliersQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} from './supplierApi'

// Export invoice API and hooks
export {
  invoiceApi,
  useGetInvoicesQuery,
  useLazyGetInvoicesQuery,
  useGetInvoiceByIdQuery,
  useLazyGetInvoiceByIdQuery,
  useGetInvoiceStatsQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
  useUpdateInvoiceStatusMutation,
  useDeleteInvoiceMutation,
} from './invoiceApi'

// Export quotation API and hooks
export {
  quotationApi,
  useGetQuotationsQuery,
  useLazyGetQuotationsQuery,
  useGetQuotationByIdQuery,
  useLazyGetQuotationByIdQuery,
  useGetQuotationStatsQuery,
  useCreateQuotationMutation,
  useUpdateQuotationMutation,
  useUpdateQuotationStatusMutation,
  useConvertQuotationToInvoiceMutation,
  useDeleteQuotationMutation,
} from './quotationApi'

// Export expense API and hooks
export {
  expenseApi,
  useGetExpensesQuery,
  useLazyGetExpensesQuery,
  useGetExpenseByIdQuery,
  useLazyGetExpenseByIdQuery,
  useGetExpenseStatsQuery,
  useGetExpensesByCategoryQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useUpdateExpenseStatusMutation,
  useApproveExpenseMutation,
  useRejectExpenseMutation,
  useDeleteExpenseMutation,
} from './expenseApi'

// Export payroll API and hooks
export {
  payrollApi,
  useGetPayrollsQuery,
  useLazyGetPayrollsQuery,
  useGetPayrollByIdQuery,
  useLazyGetPayrollByIdQuery,
  useGetPayrollStatsQuery,
  useGetPayrollByPeriodQuery,
  useLazyGetPayrollByPeriodQuery,
  useCreatePayrollMutation,
  useUpdatePayrollMutation,
  useUpdatePayrollStatusMutation,
  useApprovePayrollMutation,
  useProcessPayrollMutation,
  useCancelPayrollMutation,
  useDeletePayrollMutation,
  useLazyGeneratePayslipQuery,
} from './payrollApi'

// Export staff API and hooks
export {
  staffApi,
  useGetStaffQuery,
  useLazyGetStaffQuery,
  useGetStaffByIdQuery,
  useLazyGetStaffByIdQuery,
  useGetStaffStatsQuery,
  useGetActiveStaffQuery,
  useGetStaffByDepartmentQuery,
  useCreateStaffMutation,
  useUpdateStaffMutation,
  useUpdateStaffStatusMutation,
  useUploadStaffAvatarMutation,
  useGrantPortalAccessMutation,
  useRevokePortalAccessMutation,
  useTerminateStaffMutation,
  useDeleteStaffMutation,
} from './staffApi'

// Export user API and hooks (for Admin panel)
export {
  userApi,
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useGetUserByIdQuery,
  useLazyGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useActivateUserMutation,
  useDeactivateUserMutation,
  useResetUserPasswordMutation,
} from './userApi'

// Export tax API and hooks
export {
  taxApi,
  useGetTaxReportsQuery,
  useLazyGetTaxReportsQuery,
  useGetTaxStatsQuery,
  useGenerateTaxReportMutation,
  useFileTaxReportMutation,
  useMarkTaxPaidMutation,
  useLazyDownloadTaxReportQuery,
} from './taxApi'

// Export analytics API and hooks
export {
  analyticsApi,
  useGetAnalyticsQuery,
  useLazyGetAnalyticsQuery,
  useGetRevenueBreakdownQuery,
  useLazyGetRevenueBreakdownQuery,
  useGetTopCustomersQuery,
  useLazyGetTopCustomersQuery,
  useGetSalesTrendQuery,
  useLazyGetSalesTrendQuery,
} from './analyticsApi'

// Export inventory transaction API and hooks
export {
  inventoryTransactionApi,
  useGetInventoryTransactionsQuery,
  useLazyGetInventoryTransactionsQuery,
  useGetInventoryTransactionByIdQuery,
  useLazyGetInventoryTransactionByIdQuery,
  useGetInventoryTransactionStatsQuery,
  useGetTransactionsByProductQuery,
  useLazyGetTransactionsByProductQuery,
  useCreateInventoryTransactionMutation,
  useUpdateInventoryTransactionMutation,
  useCancelInventoryTransactionMutation,
  useDeleteInventoryTransactionMutation,
} from './inventoryTransactionApi'

// Export template API and hooks
export {
  templateApi,
  useUploadTemplateMutation,
  useGetTemplatesQuery,
  useLazyGetTemplatesQuery,
  useDeleteTemplateMutation,
} from './templateApi'

// Export account API and hooks
export {
  accountApi,
  useUpdateAccountMutation,
  useUploadAccountLogoMutation,
  useDeleteAccountLogoMutation,
} from './accountApi'
