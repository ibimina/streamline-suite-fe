// Inventory Transaction types for the frontend

export type TransactionType = 'stock_in' | 'stock_out' | 'adjustment' | 'transfer'
export type TransactionStatus = 'pending' | 'completed' | 'cancelled'

export interface InventoryTransaction {
  _id: string
  product: string
  productName?: string
  transactionType: TransactionType
  status: TransactionStatus
  quantity: number
  unitCost: number
  totalValue: number
  reference: string
  warehouse?: string
  warehouseName?: string
  sourceWarehouse?: string
  destinationWarehouse?: string
  serialNumbers?: string[]
  batchNumber?: string
  expiryDate?: string
  notes?: string
  runningStock?: number
  createdBy?: {
    _id: string
    name: string
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
  transactionType?: TransactionType
  status?: TransactionStatus
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
  transactionType: TransactionType
  quantity: number
  unitCost?: number
  reference?: string
  warehouse?: string
  sourceWarehouse?: string
  destinationWarehouse?: string
  serialNumbers?: string[]
  batchNumber?: string
  expiryDate?: string
  notes?: string
}

export interface UpdateInventoryTransactionData {
  status?: TransactionStatus
  notes?: string
}
