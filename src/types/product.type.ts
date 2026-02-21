export interface Product {
  _id?: string
  sku?: string
  barcode?: string
  name: string
  description?: string
  type: 'product' | 'service' | 'consumable' | 'digital'
  trackInventory?: boolean
  trackSerialNumber?: boolean
  trackExpiryDate?: boolean
  expiryDate?: string
  costPrice?: number
  sellingPrice: number
  wholesalePrice?: number
  unit?: string
  currentStock?: number
  minStock?: number
  lowStockAlert?: number
  category?: string
  brand?: string
  supplier?: string
  alternativeSuppliers?: string[]
  images?: string[]
  salesTaxRate?: number
  purchaseTaxRate?: number
  isActive?: boolean
  companyId?: string
  createdBy?: string
  createdAt?: string
  updatedAt?: string
}
