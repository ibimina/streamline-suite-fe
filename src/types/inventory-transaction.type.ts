// Inventory Transaction types for the frontend

export type TransactionType =
  | 'purchase'
  | 'sale'
  | 'return_from_customer'
  | 'return_to_supplier'
  | 'adjustment'
  | 'transfer'
  | 'production_in'
  | 'production_out'
  | 'completed'

export type TransactionStatus = 'pending' | 'completed' | 'cancelled'

export interface InventoryTransaction {
  _id: string
  product: string | { _id: string; name: string; sku: string; currentStock?: number }
  productName?: string
  status: TransactionType
  quantity: number
  unitCost: number
  totalValue?: number
  reference: string
  referenceId?: string
  warehouse?: string
  warehouseName?: string
  runningBalance?: number
  runningStock?: number
  averageCost?: number
  serialNumbers?: string[]
  expiryDate?: string
  notes?: string
  account: string
  createdBy?: {
    _id: string
    firstName?: string
    lastName?: string
    name?: string
    email?: string
  }
  createdAt: string
  updatedAt: string
}

export interface InventoryTransactionQueryParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  productId?: string
  status?: TransactionType
  warehouseId?: string
  startDate?: string
  endDate?: string
}

export interface InventoryTransactionsResponse {
  payload: {
    inventoryTransactions: InventoryTransaction[]
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface InventoryTransactionResponse {
  payload: {
    inventoryTransaction: InventoryTransaction
  }
}

export interface InventoryTransactionStats {
  totalTransactions: number
  stockIn: number
  stockOut: number
  adjustments: number
  transfers: number
  pendingCount: number
}

export interface InventoryTransactionStatsResponse {
  payload: InventoryTransactionStats
}

export interface CreateInventoryTransactionData {
  product: string
  status: TransactionType
  quantity: number
  unitCost?: number
  reference?: string
  warehouse?: string
  serialNumbers?: string[]
  expiryDate?: string
  notes?: string
}

export interface UpdateInventoryTransactionData {
  status?: string
  notes?: string
}
