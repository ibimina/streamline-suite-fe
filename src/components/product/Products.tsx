'use client'
import React, { useState, useEffect } from 'react'
import { PlusIcon, TrashIcon, PencilIcon, SearchIcon, FilterIcon, EyeIcon } from '../Icons'
import ProductForm from './ProductForm'
import { Product } from '@/types/product.type'
import Link from 'next/link'
import LoadingSpinner from '../shared/LoadingSpinner'
import { useDeleteProductMutation, useGetProductsQuery } from '@/store/api/productApi'
import { toast } from 'react-toastify'
import DeleteConfirmationModal from '../shared/DeleteConfirmationModal'

const Products = () => {
  const { data, isLoading: loading } = useGetProductsQuery()
  const [deleteProduct] = useDeleteProductMutation()
  const products = data?.payload?.products ?? []
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<
    'all' | 'product' | 'service' | 'consumable' | 'digital'
  >('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [productId, setProductId] = useState<string | null>(null)

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleDeleteProduct = (productId: string) => {
    setShowDeleteModal(true)
    setProductId(productId)
  }

  const confirmDeleteProduct = async () => {
    if (!productId) return
    try {
      await deleteProduct(productId).unwrap()
      toast.success('Product deleted successfully')
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Failed to delete product')
    } finally {
      setShowDeleteModal(false)
      setProductId(null)
    }
  }

  const getStockStatus = (product: Product) => {
    if (!product.trackInventory) return null

    const currentStock = product.currentStock || 0
    const lowStockAlert = product.lowStockAlert || 0
    const minStock = product.minStock || 0

    if (currentStock === 0) return 'out-of-stock'
    if (currentStock <= minStock) return 'critical'
    if (currentStock <= lowStockAlert) return 'low'
    return 'in-stock'
  }

  const getStockStatusColor = (status: string | null) => {
    switch (status) {
      case 'out-of-stock':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'critical':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'low':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'in-stock':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default:
        return 'bg-muted text-foreground  '
    }
  }

  const getStockStatusText = (status: string | null) => {
    switch (status) {
      case 'out-of-stock':
        return 'Out of Stock'
      case 'critical':
        return 'Critical'
      case 'low':
        return 'Low Stock'
      case 'in-stock':
        return 'In Stock'
      default:
        return 'N/A'
    }
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-foreground'>Products</h1>
          <p className='text-muted-foreground'>Manage your product catalog</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null)
            setShowForm(true)
          }}
          className='flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary'
        >
          <PlusIcon className='w-4 h-4 mr-2' />
          Add Product
        </button>
      </div>

      {/* Search and Filters */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div className='flex-1 relative'>
          <SearchIcon className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
          <input
            type='text'
            placeholder='Search products...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className='w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent   '
          />
        </div>
        <div className='flex gap-2'>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value as any)}
            className='px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary   '
          >
            <option value='all'>All Types</option>
            <option value='product'>Physical Product</option>
            <option value='service'>Service</option>
            <option value='consumable'>Consumable</option>
            <option value='digital'>Digital</option>
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className='px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary   '
          >
            <option value='all'>All Status</option>
            <option value='active'>Active</option>
            <option value='inactive'>Inactive</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className='bg-card shadow rounded-lg overflow-hidden'>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-border'>
              <thead className='bg-muted'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                    Product
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                    Type
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                    Price
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                    Stock
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                    Supplier
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                    Status
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-card divide-y divide-border'>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className='px-6 py-4 text-center text-muted-foreground'>
                      No products found.
                    </td>
                  </tr>
                ) : (
                  products.map(product => {
                    const stockStatus = getStockStatus(product)
                    return (
                      <tr key={product._id} className='hover:bg-muted '>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='flex items-center'>
                            <div className='flex-shrink-0 h-10 w-10'>
                              <div className='h-10 w-10 rounded bg-primary-light dark:bg-primary/20 flex items-center justify-center'>
                                <span className='text-sm font-medium text-primary dark:text-primary'>
                                  {product.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className='ml-4'>
                              <div className='text-sm font-medium text-foreground'>
                                {product.name}
                              </div>
                              <div className='text-sm text-muted-foreground'>
                                {product.sku && `SKU: ${product.sku}`}
                                {product.sku && product.category && ' • '}
                                {product.category}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span className='inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'>
                            {product.type.charAt(0).toUpperCase() + product.type.slice(1)}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='text-sm text-foreground'>
                            ${product.sellingPrice.toFixed(2)}
                          </div>
                          {product.costPrice && (
                            <div className='text-sm text-muted-foreground'>
                              Cost: ${product.costPrice.toFixed(2)}
                            </div>
                          )}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          {product.trackInventory ? (
                            <div>
                              <div className='text-sm text-foreground'>
                                {product.currentStock || 0} {product.unit}
                              </div>
                              {stockStatus && (
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStockStatusColor(stockStatus)}`}
                                >
                                  {getStockStatusText(stockStatus)}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className='text-sm text-muted-foreground'>Not tracked</span>
                          )}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          {product.supplier &&
                          typeof product.supplier === 'object' &&
                          product.supplier.name ? (
                            <div>
                              <div className='text-sm text-foreground font-medium'>
                                {product.supplier.name}
                              </div>
                              <div className='text-xs text-muted-foreground'>Primary Supplier</div>
                            </div>
                          ) : (
                            <span className='text-sm text-muted-foreground'>No supplier</span>
                          )}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              product.isActive
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-muted text-foreground  '
                            }`}
                          >
                            {product.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                          <div className='flex space-x-2'>
                            <Link
                              href={`products/${product._id}`}
                              className='text-primary hover:text-primary-hover dark:text-primary dark:hover:text-primary'
                              title='View Details'
                            >
                              <EyeIcon className='w-4 h-4' />
                            </Link>
                            <button
                              onClick={() => handleEditProduct(product)}
                              className='text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300'
                              title='Edit'
                            >
                              <PencilIcon className='w-4 h-4' />
                            </button>
                            <button
                              onClick={() => product._id && handleDeleteProduct(product._id)}
                              className='text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'
                              title='Delete'
                            >
                              <TrashIcon className='w-4 h-4' />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ProductForm
        product={editingProduct}
        onCancel={() => {
          setShowForm(false)
          setEditingProduct(null)
        }}
        open={showForm}
      />
      {showDeleteModal && (
        <DeleteConfirmationModal
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={confirmDeleteProduct}
        />
      )}
    </div>
  )
}

export default Products
