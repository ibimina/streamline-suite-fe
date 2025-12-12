'use client'
import React, { useState, useEffect } from 'react'
import { PlusIcon, TrashIcon, PencilIcon, SearchIcon, FilterIcon, ExclamationIcon } from './Icons'

export interface Product {
  id?: string
  sku: string
  barcode: string
  name: string
  description: string
  type: 'product' | 'service' | 'consumable' | 'digital'
  trackInventory: boolean
  trackSerialNumber: boolean
  trackExpiryDate: boolean
  costPrice: number
  sellingPrice: number
  wholesalePrice?: number
  unit: string
  currentStock: number
  minStock: number
  lowStockAlert: number
  category?: string
  brand?: string
  isActive: boolean
  companyId?: string
  createdBy?: string
  createdAt?: string
  updatedAt?: string
}

interface ProductFormProps {
  product: Partial<Product> | null
  onSave: (product: Product) => void
  onCancel: () => void
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Product>({
    sku: product?.sku || '',
    barcode: product?.barcode || '',
    name: product?.name || '',
    description: product?.description || '',
    type: product?.type || 'product',
    trackInventory: product?.trackInventory ?? true,
    trackSerialNumber: product?.trackSerialNumber ?? false,
    trackExpiryDate: product?.trackExpiryDate ?? false,
    costPrice: product?.costPrice || 0,
    sellingPrice: product?.sellingPrice || 0,
    wholesalePrice: product?.wholesalePrice || 0,
    unit: product?.unit || 'pcs',
    currentStock: product?.currentStock || 0,
    minStock: product?.minStock || 0,
    lowStockAlert: product?.lowStockAlert || 5,
    category: product?.category || '',
    brand: product?.brand || '',
    isActive: product?.isActive ?? true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const productTypes = [
    { value: 'product', label: 'Product' },
    { value: 'service', label: 'Service' },
    { value: 'consumable', label: 'Consumable' },
    { value: 'digital', label: 'Digital' },
  ]

  const units = ['pcs', 'kg', 'liter', 'box', 'hour', 'meter', 'pack', 'bottle', 'bag', 'roll']

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (formData.sellingPrice <= 0) newErrors.sellingPrice = 'Selling price must be greater than 0'
    if (formData.costPrice < 0) newErrors.costPrice = 'Cost price cannot be negative'
    if (formData.currentStock < 0) newErrors.currentStock = 'Current stock cannot be negative'
    if (formData.minStock < 0) newErrors.minStock = 'Minimum stock cannot be negative'
    if (formData.lowStockAlert < 0) newErrors.lowStockAlert = 'Low stock alert cannot be negative'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // Generate SKU if not provided
      if (!formData.sku) {
        const timestamp = Date.now().toString().slice(-6)
        // formData.sku = `PRD-${timestamp}`
      }
      onSave({ ...formData, id: product?.id })
    }
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>
          {product?.id ? 'Edit Product' : 'Add New Product'}
        </h2>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Basic Information */}
          <div>
            <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
              Basic Information
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {/* Name */}
              <div className='md:col-span-2'>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Product Name *
                </label>
                <input
                  type='text'
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  placeholder='Product name'
                />
                {errors.name && <p className='text-red-500 text-sm mt-1'>{errors.name}</p>}
              </div>

              {/* Type */}
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={e => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                >
                  {productTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* SKU */}
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  SKU
                </label>
                <input
                  type='text'
                  value={formData.sku}
                  onChange={e => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  placeholder='Auto-generated if empty'
                />
              </div>

              {/* Barcode */}
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Barcode
                </label>
                <input
                  type='text'
                  value={formData.barcode}
                  onChange={e => setFormData(prev => ({ ...prev, barcode: e.target.value }))}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  placeholder='Product barcode'
                />
              </div>

              {/* Category */}
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Category
                </label>
                <input
                  type='text'
                  value={formData.category}
                  onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  placeholder='Product category'
                />
              </div>

              {/* Brand */}
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Brand
                </label>
                <input
                  type='text'
                  value={formData.brand}
                  onChange={e => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  placeholder='Product brand'
                />
              </div>

              {/* Unit */}
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Unit
                </label>
                <select
                  value={formData.unit}
                  onChange={e => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                >
                  {units.map(unit => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Status
                </label>
                <select
                  value={formData.isActive ? 'active' : 'inactive'}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, isActive: e.target.value === 'active' }))
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                >
                  <option value='active'>Active</option>
                  <option value='inactive'>Inactive</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className='mt-4'>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                rows={3}
                placeholder='Product description'
              />
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>Pricing</h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {/* Cost Price */}
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Cost Price
                </label>
                <input
                  type='number'
                  min='0'
                  step='0.01'
                  value={formData.costPrice}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, costPrice: parseFloat(e.target.value) || 0 }))
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  placeholder='0.00'
                />
                {errors.costPrice && (
                  <p className='text-red-500 text-sm mt-1'>{errors.costPrice}</p>
                )}
              </div>

              {/* Selling Price */}
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Selling Price *
                </label>
                <input
                  type='number'
                  min='0'
                  step='0.01'
                  value={formData.sellingPrice}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      sellingPrice: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  placeholder='0.00'
                />
                {errors.sellingPrice && (
                  <p className='text-red-500 text-sm mt-1'>{errors.sellingPrice}</p>
                )}
              </div>

              {/* Wholesale Price */}
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Wholesale Price
                </label>
                <input
                  type='number'
                  min='0'
                  step='0.01'
                  value={formData.wholesalePrice}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      wholesalePrice: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  placeholder='0.00'
                />
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div>
            <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>Inventory</h3>

            {/* Tracking Options */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
              <div className='flex items-center'>
                <input
                  type='checkbox'
                  checked={formData.trackInventory}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, trackInventory: e.target.checked }))
                  }
                  className='mr-2 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded'
                />
                <label className='text-sm text-gray-700 dark:text-gray-300'>Track Inventory</label>
              </div>

              <div className='flex items-center'>
                <input
                  type='checkbox'
                  checked={formData.trackSerialNumber}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, trackSerialNumber: e.target.checked }))
                  }
                  className='mr-2 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded'
                />
                <label className='text-sm text-gray-700 dark:text-gray-300'>
                  Track Serial Numbers
                </label>
              </div>

              <div className='flex items-center'>
                <input
                  type='checkbox'
                  checked={formData.trackExpiryDate}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, trackExpiryDate: e.target.checked }))
                  }
                  className='mr-2 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded'
                />
                <label className='text-sm text-gray-700 dark:text-gray-300'>
                  Track Expiry Date
                </label>
              </div>
            </div>

            {/* Stock Levels */}
            {formData.trackInventory && (
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                    Current Stock
                  </label>
                  <input
                    type='number'
                    min='0'
                    value={formData.currentStock}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        currentStock: parseInt(e.target.value) || 0,
                      }))
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                    placeholder='0'
                  />
                  {errors.currentStock && (
                    <p className='text-red-500 text-sm mt-1'>{errors.currentStock}</p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                    Minimum Stock
                  </label>
                  <input
                    type='number'
                    min='0'
                    value={formData.minStock}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, minStock: parseInt(e.target.value) || 0 }))
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                    placeholder='0'
                  />
                  {errors.minStock && (
                    <p className='text-red-500 text-sm mt-1'>{errors.minStock}</p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                    Low Stock Alert
                  </label>
                  <input
                    type='number'
                    min='0'
                    value={formData.lowStockAlert}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        lowStockAlert: parseInt(e.target.value) || 0,
                      }))
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                    placeholder='5'
                  />
                  {errors.lowStockAlert && (
                    <p className='text-red-500 text-sm mt-1'>{errors.lowStockAlert}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className='flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-600'>
            <button
              type='button'
              onClick={onCancel}
              className='px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500'
            >
              {product?.id ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface ProductsProps {
  // Add any props if needed
}

const Products: React.FC<ProductsProps> = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'low_stock'>(
    'all'
  )
  const [typeFilter, setTypeFilter] = useState<
    'all' | 'product' | 'service' | 'consumable' | 'digital'
  >('all')
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  // Sample data - replace with API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const sampleProducts: Product[] = [
        {
          id: '1',
          sku: 'LAPTOP-001',
          barcode: '1234567890123',
          name: 'Dell Laptop Inspiron 15',
          description: 'High-performance laptop for business use',
          type: 'product',
          trackInventory: true,
          trackSerialNumber: true,
          trackExpiryDate: false,
          costPrice: 800,
          sellingPrice: 1200,
          wholesalePrice: 1000,
          unit: 'pcs',
          currentStock: 25,
          minStock: 5,
          lowStockAlert: 10,
          category: 'Electronics',
          brand: 'Dell',
          isActive: true,
          createdAt: '2023-01-15',
        },
        {
          id: '2',
          sku: 'SERV-001',
          barcode: '',
          name: 'IT Consultation Service',
          description: 'Professional IT consultation and support',
          type: 'service',
          trackInventory: false,
          trackSerialNumber: false,
          trackExpiryDate: false,
          costPrice: 0,
          sellingPrice: 150,
          unit: 'hour',
          currentStock: 0,
          minStock: 0,
          lowStockAlert: 0,
          category: 'Services',
          brand: '',
          isActive: true,
          createdAt: '2023-02-20',
        },
        {
          id: '3',
          sku: 'CAM-001',
          barcode: '9876543210987',
          name: 'Security Camera ProView',
          description: 'High-definition security camera with night vision',
          type: 'product',
          trackInventory: true,
          trackSerialNumber: true,
          trackExpiryDate: false,
          costPrice: 150,
          sellingPrice: 300,
          wholesalePrice: 250,
          unit: 'pcs',
          currentStock: 3,
          minStock: 5,
          lowStockAlert: 8,
          category: 'Security',
          brand: 'ProView',
          isActive: true,
          createdAt: '2023-03-10',
        },
      ]
      setProducts(sampleProducts)
      setFilteredProducts(sampleProducts)
      setLoading(false)
    }, 1000)
  }, [])

  // Filter products
  useEffect(() => {
    const filtered = products.filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && product.isActive) ||
        (statusFilter === 'inactive' && !product.isActive) ||
        (statusFilter === 'low_stock' && product.currentStock <= product.lowStockAlert)

      const matchesType = typeFilter === 'all' || product.type === typeFilter

      return matchesSearch && matchesStatus && matchesType
    })

    // setFilteredProducts(filtered)
  }, [searchTerm, statusFilter, typeFilter, products])

  const handleSaveProduct = (productData: Product) => {
    if (productData.id) {
      // Update existing product
      setProducts(prev =>
        prev.map(product =>
          product.id === productData.id
            ? { ...productData, updatedAt: new Date().toISOString() }
            : product
        )
      )
    } else {
      // Add new product
      const newProduct: Product = {
        ...productData,
        id: `product-${Date.now()}`,
        createdAt: new Date().toISOString(),
      }
      setProducts(prev => [...prev, newProduct])
    }

    setShowForm(false)
    setEditingProduct(null)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(product => product.id !== productId))
    }
  }

  const getStockStatus = (product: Product) => {
    if (!product.trackInventory) return null

    if (product.currentStock <= 0) {
      return {
        status: 'Out of Stock',
        color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      }
    } else if (product.currentStock <= product.lowStockAlert) {
      return {
        status: 'Low Stock',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      }
    } else {
      return {
        status: 'In Stock',
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      }
    }
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>Products</h1>
        <button
          onClick={() => setShowForm(true)}
          className='flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500'
        >
          <PlusIcon className='w-5 h-5' />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className='bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm'>
        <div className='flex flex-col lg:flex-row gap-4'>
          {/* Search */}
          <div className='flex-1 relative'>
            <SearchIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
            <input
              type='text'
              placeholder='Search products...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            />
          </div>

          <div className='flex flex-col md:flex-row gap-4'>
            {/* Type Filter */}
            <div className='flex items-center space-x-2'>
              <FilterIcon className='w-5 h-5 text-gray-400' />
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value as any)}
                className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              >
                <option value='all'>All Types</option>
                <option value='product'>Product</option>
                <option value='service'>Service</option>
                <option value='consumable'>Consumable</option>
                <option value='digital'>Digital</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as any)}
                className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              >
                <option value='all'>All Status</option>
                <option value='active'>Active</option>
                <option value='inactive'>Inactive</option>
                <option value='low_stock'>Low Stock</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden'>
        {loading ? (
          <div className='p-8 text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto'></div>
            <p className='mt-2 text-gray-500 dark:text-gray-400'>Loading products...</p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
              <thead className='bg-gray-50 dark:bg-gray-700'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                    Product
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                    Type
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                    Price
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                    Stock
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                    Status
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
                {filteredProducts.map(product => {
                  const stockStatus = getStockStatus(product)
                  return (
                    <tr key={product.id} className='hover:bg-gray-50 dark:hover:bg-gray-700'>
                      <td className='px-6 py-4'>
                        <div>
                          <div className='text-sm font-medium text-gray-900 dark:text-white flex items-center'>
                            {product.name}
                            {stockStatus && stockStatus.status === 'Low Stock' && (
                              <ExclamationIcon className='w-4 h-4 text-yellow-500 ml-2' />
                            )}
                            {stockStatus && stockStatus.status === 'Out of Stock' && (
                              <ExclamationIcon className='w-4 h-4 text-red-500 ml-2' />
                            )}
                          </div>
                          <div className='text-sm text-gray-500 dark:text-gray-400'>
                            SKU: {product.sku}
                          </div>
                          {(product.category || product.brand) && (
                            <div className='text-xs text-gray-400'>
                              {product.brand && `${product.brand} • `}
                              {product.category}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span className='inline-flex px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 capitalize'>
                          {product.type}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white'>
                        <div>${product.sellingPrice.toFixed(2)}</div>
                        {product.costPrice > 0 && (
                          <div className='text-xs text-gray-500'>
                            Cost: ${product.costPrice.toFixed(2)}
                          </div>
                        )}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        {product.trackInventory ? (
                          <div>
                            <div className='text-sm text-gray-900 dark:text-white'>
                              {product.currentStock} {product.unit}
                            </div>
                            {stockStatus && (
                              <span
                                className={`inline-flex px-2 py-1 text-xs rounded-full ${stockStatus.color}`}
                              >
                                {stockStatus.status}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className='text-sm text-gray-500 dark:text-gray-400'>N/A</span>
                        )}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`inline-flex px-2 py-1 text-xs rounded-full ${
                            product.isActive
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}
                        >
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                        <div className='flex space-x-2'>
                          <button
                            onClick={() => handleEditProduct(product)}
                            className='text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-300'
                          >
                            <PencilIcon className='w-4 h-4' />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id!)}
                            className='text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'
                          >
                            <TrashIcon className='w-4 h-4' />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {filteredProducts.length === 0 && (
              <div className='text-center py-8'>
                <p className='text-gray-500 dark:text-gray-400'>No products found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={() => {
            setShowForm(false)
            setEditingProduct(null)
          }}
        />
      )}
    </div>
  )
}

export default Products
