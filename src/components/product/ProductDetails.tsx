'use client'
import { useState } from 'react'
import ProductForm from './ProductForm'
import { useParams } from 'next/navigation'
import { useDeleteProductMutation, useGetProductByIdQuery } from '@/store/api/productApi'
import LoadingSpinner from '../shared/LoadingSpinner'
import Link from 'next/link'
import DeleteConfirmationModal from '../shared/DeleteConfirmationModal'
import { useRouter } from 'next/navigation'

const ProductDetails = () => {
  const [showForm, setShowForm] = useState(false)
  const router = useRouter()

  const params = useParams()
  const id = params?.id as string
  const { data, isLoading: loading } = useGetProductByIdQuery(id, {
    skip: !id,
  })
  const [deleteProduct] = useDeleteProductMutation()

  const product = data?.payload ?? null
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleDelete = () => {
    setShowDeleteModal(true)
  }

  const confirmDeleteProduct = async () => {
    if (!id) return

    try {
      await deleteProduct(id).unwrap()
      // Redirect to products list after deletion
      router.push('/products')
    } catch (error: any) {
      alert(error?.data?.message || 'Failed to delete product')
    }
  }

  const getStockStatus = () => {
    if (!product?.trackInventory) return null

    const currentStock = product?.currentStock || 0
    const lowStockAlert = product?.lowStockAlert || 0
    const minStock = product?.minStock || 0

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
        return 'Critical Stock'
      case 'low':
        return 'Low Stock'
      case 'in-stock':
        return 'In Stock'
      default:
        return 'N/A'
    }
  }

  const stockStatus = getStockStatus()

  if (loading) {
    return (
      <div className='min-h-screen bg-muted '>
        <LoadingSpinner />
      </div>
    )
  }

  if (!product) {
    return (
      <div className='min-h-screen bg-muted '>
        <div className='bg-card border-b border-border px-6 py-4'>
          <Link
            href={'/products'}
            className='text-muted-foreground mb-2 hover:text-muted-foreground dark:hover:text-muted-foreground flex items-center'
          >
            <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
            Back to Products
          </Link>
        </div>
        <div className='p-6'>Product not found.</div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-muted '>
      <div className='bg-card border-b border-border px-6 py-4'>
        <Link
          href={'/products'}
          className='text-muted-foreground mb-2 hover:text-muted-foreground dark:hover:text-muted-foreground flex items-center'
        >
          <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15 19l-7-7 7-7'
            />
          </svg>
          Back to Products
        </Link>

        <div className='flex items-center justify-between max-w-7xl mx-auto'>
          <div className='flex items-center space-x-4'>
            <div className='shrink-0 h-16 w-16'>
              <div className='h-16 w-16 rounded-lg bg-primary-light dark:bg-primary/20 flex items-center justify-center'>
                <span className='text-xl font-bold text-primary dark:text-primary'>
                  {product.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div>
              <h1 className='text-2xl font-bold text-foreground'>{product.name}</h1>
              <div className='flex items-center gap-2 mt-1'>
                {product.sku && <p className='text-sm text-muted-foreground'>SKU: {product.sku}</p>}
                {product.sku && product.category && (
                  <span className='text-muted-foreground'>•</span>
                )}
                {product.category && (
                  <p className='text-sm text-muted-foreground'>{product.category}</p>
                )}
              </div>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                product.isActive
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-muted text-foreground  '
              }`}
            >
              {product.isActive ? 'Active' : 'Inactive'}
            </span>
            {stockStatus && (
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStockStatusColor(stockStatus)}`}
              >
                {getStockStatusText(stockStatus)}
              </span>
            )}
            <button
              onClick={() => setShowForm(true)}
              className='px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary'
            >
              Edit Product
            </button>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Basic Information */}
          <div className='bg-muted rounded-lg p-4'>
            <h3 className='text-lg font-semibold text-foreground mb-4'>Basic Information</h3>
            <div className='space-y-3'>
              <div>
                <label className='block text-sm font-medium text-muted-foreground'>
                  Product Name
                </label>
                <p className='text-foreground'>{product.name}</p>
              </div>
              {product.sku && (
                <div>
                  <label className='block text-sm font-medium text-muted-foreground'>SKU</label>
                  <p className='text-foreground font-mono'>{product.sku}</p>
                </div>
              )}
              {product.barcode && (
                <div>
                  <label className='block text-sm font-medium text-muted-foreground'>Barcode</label>
                  <p className='text-foreground font-mono'>{product.barcode}</p>
                </div>
              )}
              <div>
                <label className='block text-sm font-medium text-muted-foreground'>
                  Product Type
                </label>
                <span className='inline-flex px-2 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'>
                  {product.type.charAt(0).toUpperCase() + product.type.slice(1)}
                </span>
              </div>
              {product.description && (
                <div>
                  <label className='block text-sm font-medium text-muted-foreground'>
                    Description
                  </label>
                  <p className='text-foreground'>{product.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Pricing Information */}
          <div className='bg-muted rounded-lg p-4'>
            <h3 className='text-lg font-semibold text-foreground mb-4'>Pricing Information</h3>
            <div className='space-y-3'>
              <div>
                <label className='block text-sm font-medium text-muted-foreground'>
                  Selling Price
                </label>
                <p className='text-xl font-bold text-foreground'>
                  ${product.sellingPrice.toFixed(2)}
                </p>
              </div>
              {product.costPrice && (
                <div>
                  <label className='block text-sm font-medium text-muted-foreground'>
                    Cost Price
                  </label>
                  <p className='text-foreground'>${product.costPrice.toFixed(2)}</p>
                </div>
              )}
              {product.wholesalePrice && (
                <div>
                  <label className='block text-sm font-medium text-muted-foreground'>
                    Wholesale Price
                  </label>
                  <p className='text-foreground'>${product.wholesalePrice.toFixed(2)}</p>
                </div>
              )}
              {product.costPrice && (
                <div>
                  <label className='block text-sm font-medium text-muted-foreground'>
                    Profit Margin
                  </label>
                  <p className='text-green-600 dark:text-green-400 font-medium'>
                    {(
                      ((product.sellingPrice - product.costPrice) / product.sellingPrice) *
                      100
                    ).toFixed(1)}
                    %
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Inventory Information */}
          {product.trackInventory && (
            <div className='bg-muted rounded-lg p-4'>
              <h3 className='text-lg font-semibold text-foreground mb-4'>Inventory Information</h3>
              <div className='space-y-3'>
                <div>
                  <label className='block text-sm font-medium text-muted-foreground'>
                    Current Stock
                  </label>
                  <p className='text-xl font-bold text-foreground'>
                    {product.currentStock || 0} {product.unit}
                  </p>
                </div>
                {product.minStock && (
                  <div>
                    <label className='block text-sm font-medium text-muted-foreground'>
                      Minimum Stock
                    </label>
                    <p className='text-foreground'>
                      {product.minStock} {product.unit}
                    </p>
                  </div>
                )}
                {product.lowStockAlert && (
                  <div>
                    <label className='block text-sm font-medium text-muted-foreground'>
                      Low Stock Alert
                    </label>
                    <p className='text-foreground'>
                      {product.lowStockAlert} {product.unit}
                    </p>
                  </div>
                )}
                {product.trackExpiryDate && product.expiryDate && (
                  <div>
                    <label className='block text-sm font-medium text-muted-foreground'>
                      Expiry Date
                    </label>
                    <p className='text-foreground'>
                      {new Date(product.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Product Details */}
          <div className='bg-muted rounded-lg p-4'>
            <h3 className='text-lg font-semibold text-foreground mb-4'>Product Details</h3>
            <div className='space-y-3'>
              {product.category && (
                <div>
                  <label className='block text-sm font-medium text-muted-foreground'>
                    Category
                  </label>
                  <p className='text-foreground'>{product.category}</p>
                </div>
              )}
              {product.brand && (
                <div>
                  <label className='block text-sm font-medium text-muted-foreground'>Brand</label>
                  <p className='text-foreground'>{product.brand}</p>
                </div>
              )}
              {product.unit && (
                <div>
                  <label className='block text-sm font-medium text-muted-foreground'>
                    Unit of Measurement
                  </label>
                  <p className='text-foreground'>{product.unit}</p>
                </div>
              )}
            </div>
          </div>

          {/* Supplier Information */}
          {(product.supplier || product.alternativeSuppliers?.length) && (
            <div className='bg-muted rounded-lg p-4'>
              <h3 className='text-lg font-semibold text-foreground mb-4'>Supplier Information</h3>
              <div className='space-y-4'>
                {product.supplier &&
                  typeof product.supplier === 'object' &&
                  product.supplier.name && (
                    <div>
                      <label className='block text-sm font-medium text-muted-foreground mb-2'>
                        Primary Supplier
                      </label>
                      <div className='flex items-center p-3 bg-white  rounded-md border-l-4 border-primary'>
                        <div className='flex-1'>
                          <p className='font-medium text-foreground'>{product.supplier.name}</p>
                          <span className='px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full'>
                            Primary
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                {product.alternativeSuppliers && product.alternativeSuppliers.length > 0 && (
                  <div>
                    <label className='block text-sm font-medium text-muted-foreground mb-2'>
                      Alternative Suppliers
                    </label>
                    <div className='space-y-2'>
                      {product.alternativeSuppliers.map((supplier, index) => {
                        const supplierId = typeof supplier === 'object' ? supplier._id : supplier
                        const supplierName = typeof supplier === 'object' ? supplier.name : supplier
                        return (
                          <div
                            key={supplierId || index}
                            className='flex items-center p-3 bg-white  rounded-md border-l-4 border-border'
                          >
                            <div className='flex-1'>
                              <p className='font-medium text-foreground'>{supplierName}</p>
                              <span className='px-2 py-1 text-xs bg-muted text-foreground   rounded-full'>
                                Alternative
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tracking Settings */}
          <div className='bg-muted rounded-lg p-4'>
            <h3 className='text-lg font-semibold text-foreground mb-4'>Tracking Settings</h3>
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-secondary-foreground'>Track Inventory</span>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    product.trackInventory
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-muted text-foreground  '
                  }`}
                >
                  {product.trackInventory ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-secondary-foreground'>Track Serial Numbers</span>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    product.trackSerialNumber
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-muted text-foreground  '
                  }`}
                >
                  {product.trackSerialNumber ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-secondary-foreground'>Track Expiry Dates</span>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    product.trackExpiryDate
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-muted text-foreground  '
                  }`}
                >
                  {product.trackExpiryDate ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>

          {/* Tax Information */}
          {(product.salesTaxRate || product.purchaseTaxRate) && (
            <div className='bg-muted rounded-lg p-4'>
              <h3 className='text-lg font-semibold text-foreground mb-4'>Tax Information</h3>
              <div className='space-y-3'>
                {product.salesTaxRate && (
                  <div>
                    <label className='block text-sm font-medium text-muted-foreground'>
                      Sales Tax Rate
                    </label>
                    <p className='text-foreground'>{product.salesTaxRate}%</p>
                  </div>
                )}
                {product.purchaseTaxRate && (
                  <div>
                    <label className='block text-sm font-medium text-muted-foreground'>
                      Purchase Tax Rate
                    </label>
                    <p className='text-foreground'>{product.purchaseTaxRate}%</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className='bg-muted rounded-lg p-4 lg:col-span-2'>
            <h3 className='text-lg font-semibold text-foreground mb-4'>Record Information</h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
              {product.createdAt && (
                <div>
                  <label className='block text-sm font-medium text-muted-foreground'>Created</label>
                  <p className='text-foreground'>
                    {new Date(product.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}
              {product.updatedAt && (
                <div>
                  <label className='block text-sm font-medium text-muted-foreground'>
                    Last Updated
                  </label>
                  <p className='text-foreground'>
                    {new Date(product.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
              {product._id && (
                <div>
                  <label className='block text-sm font-medium text-muted-foreground'>
                    Product ID
                  </label>
                  <p className='text-foreground font-mono text-xs'>{product._id}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='mt-8 flex items-center justify-between p-6 bg-card border-t border-border rounded-lg'>
        <button
          onClick={handleDelete}
          className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500'
        >
          Delete Product
        </button>
        <div className='text-sm text-muted-foreground'>
          Last updated:{' '}
          {product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : 'Never'}
        </div>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={product as any}
          onCancel={() => {
            setShowForm(false)
          }}
          open={showForm}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmationModal
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={confirmDeleteProduct}
          open={showDeleteModal}
        />
      )}
    </div>
  )
}

export default ProductDetails
