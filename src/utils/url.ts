const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const createAccountUrl = `${BASE_URL}/auth/createAccount`
export const loginUrl = `${BASE_URL}/auth/login`
export const refreshTokenUrl = `${BASE_URL}/auth/refreshToken`
export const logoutUrl = `${BASE_URL}/customer-portal/logout`

export const getDashboardStatsUrl = `${BASE_URL}/customer-portal/account/dashboard-stats`

export const getCustomersUrl = `${BASE_URL}/customer-portal/account-customers`
export const getCustomerByIdUrl = (customerId: string) =>
  `${BASE_URL}/customer-portal/account-customers/${customerId}`
export const createCustomerUrl = `${BASE_URL}/customer-portal/account-customers/create-account-customer`
export const updateCustomerUrl = (customerId: string) =>
  `${BASE_URL}/customer-portal/account-customers/${customerId}/update`
