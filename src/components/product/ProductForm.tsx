'use client'
import React, { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Sheet, SheetContent, SheetHeader } from '../ui/sheet'
import { Select, SelectContent, SelectValue, SelectTrigger, SelectItem } from '../ui/select'
import { MultiSelect, MultiSelectOption } from '../ui/multi-select'
import { productSchema, ProductFormData } from '@/schemas/product.schema'
import { Product } from '@/types/product.type'
import InputErrorWrapper from '../shared/InputErrorWrapper'
import { useCreateProductMutation, useUpdateProductMutation } from '@/store/api/productApi'
import { toast } from 'react-toastify'
import { useGetSuppliersQuery } from '@/store/api/supplierApi'

interface ProductFormProps {
  product: Partial<Product> | null
  onCancel: () => void
  open: boolean
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onCancel, open }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
    setValue,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      sku: product?.sku || '',
      barcode: product?.barcode || '',
      name: product?.name || '',
      description: product?.description || '',
      type: product?.type || 'product',
      trackInventory: product?.trackInventory || false,
      trackSerialNumber: product?.trackSerialNumber || false,
      trackExpiryDate: product?.trackExpiryDate || false,
      expiryDate: product?.expiryDate || '',
      costPrice: product?.costPrice || 0,
      sellingPrice: product?.sellingPrice || 0,
      wholesalePrice: product?.wholesalePrice || 0,
      unit: product?.unit || '',
      lowStockAlert: product?.lowStockAlert || 0,
      currentStock: product?.currentStock || 0,
      category: product?.category || '',
      brand: product?.brand || '',
      supplier:
        typeof product?.supplier === 'object' ? product.supplier._id : product?.supplier || '',
      alternativeSuppliers:
        product?.alternativeSuppliers?.map(supplier =>
          typeof supplier === 'object' ? supplier._id : supplier
        ) || [],
      images: product?.images || [],
      salesTaxRate: product?.salesTaxRate || 0,
      purchaseTaxRate: product?.purchaseTaxRate || 0,
      isActive: product?.isActive !== undefined ? product.isActive : true,
    },
  })
  const alternativeSuppliers = useWatch({ control, name: 'alternativeSuppliers' }) || []
  const [createProduct] = useCreateProductMutation()
  const [updateProduct] = useUpdateProductMutation()
  const { data } = useGetSuppliersQuery()
  const suppliers = data?.payload?.suppliers || []
  const onSubmit = async (data: ProductFormData) => {
    try {
      if (product?._id) {
        await updateProduct({ productId: product._id, data }).unwrap()
        toast.success('Product updated successfully')
      } else {
        await createProduct(data).unwrap()
        toast.success('Product created successfully')
      }
      reset()
    } catch (error) {
      console.error('Error saving product:', error)
      toast.error('Failed to save product')
    }
  }

  const handleCancel = () => {
    reset()
    onCancel()
  }

  return (
    <Sheet open={open} onOpenChange={handleCancel}>
      <SheetContent className='w-full sm:max-w-2xl bg-white overflow-y-auto'>
        <SheetHeader className='pb-6'>
          <h2 className='text-xl font-semibold text-foreground'>
            {product?._id ? 'Edit Product' : 'Add New Product'}
          </h2>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          {/* Basic Information */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <label className='block text-sm font-medium text-secondary-foreground mb-1'>
              Product Name <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              {...register('name')}
              className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary   '
              placeholder='Enter product name'
            />
            {errors.name && <InputErrorWrapper message={errors.name?.message || ''} />}

            <label className='block text-sm font-medium text-secondary-foreground mb-1'>
              SKU <span className='text-xs text-muted-foreground'>(optional)</span>
            </label>
            <input
              type='text'
              {...register('sku')}
              className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary   '
              placeholder='Enter SKU'
            />
            {errors.sku && <InputErrorWrapper message={errors.sku.message || ''} />}
            <label className='block text-sm font-medium text-secondary-foreground mb-1'>
              Barcode <span className='text-xs text-muted-foreground'>(optional)</span>
            </label>
            <input
              type='text'
              {...register('barcode')}
              className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary   '
              placeholder='Enter barcode'
            />
            {errors.barcode && <InputErrorWrapper message={errors.barcode.message || ''} />}
            <label className='block text-sm font-medium text-secondary-foreground mb-1'>
              Product Type <span className='text-xs text-muted-foreground'>(optional)</span>
            </label>
            <Select
              // value={watch('type')}
              onValueChange={value => setValue('type', value as any)}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select type' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='product'>Physical Product</SelectItem>
                <SelectItem value='service'>Service</SelectItem>
                <SelectItem value='consumable'>Consumable</SelectItem>
                <SelectItem value='digital'>Digital</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && <InputErrorWrapper message={errors.type.message || ''} />}
          </div>

          {/* Description */}
          <label className='block text-sm font-medium text-secondary-foreground mb-1'>
            Description <span className='text-xs text-muted-foreground'>(optional)</span>
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary   '
            placeholder='Enter product description'
          />
          {errors.description && <InputErrorWrapper message={errors.description.message || ''} />}
          {/* Pricing */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-secondary-foreground mb-1'>
                Cost Price <span className='text-xs text-muted-foreground'>(optional)</span>
              </label>
              <input
                type='number'
                step='0.01'
                {...register('costPrice', { valueAsNumber: true })}
                className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary   '
                placeholder='0.00'
              />
              {errors.costPrice && <InputErrorWrapper message={errors.costPrice.message || ''} />}
            </div>
            <div>
              <label className='block text-sm font-medium text-secondary-foreground mb-1'>
                Selling Price <span className='text-red-500'>*</span>
              </label>
              <input
                type='number'
                step='0.01'
                {...register('sellingPrice', { valueAsNumber: true })}
                className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary   '
                placeholder='0.00'
              />
              {errors.sellingPrice && (
                <InputErrorWrapper message={errors.sellingPrice.message || ''} />
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-secondary-foreground mb-1'>
                Wholesale Price <span className='text-xs text-muted-foreground'>(optional)</span>
              </label>
              <input
                type='number'
                step='0.01'
                {...register('wholesalePrice', { valueAsNumber: true })}
                className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary   '
                placeholder='0.00'
              />
              {errors.wholesalePrice && (
                <InputErrorWrapper message={errors.wholesalePrice.message || ''} />
              )}
            </div>
          </div>
          {/* Category and Brand */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-secondary-foreground mb-1'>
                Category <span className='text-xs text-muted-foreground'>(optional)</span>
              </label>
              <input
                type='text'
                {...register('category')}
                className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary   '
                placeholder='Enter category'
              />
              {errors.category && <InputErrorWrapper message={errors.category.message || ''} />}
            </div>
            <div>
              <label className='block text-sm font-medium text-secondary-foreground mb-1'>
                Brand <span className='text-xs text-muted-foreground'>(optional)</span>
              </label>
              <input
                type='text'
                {...register('brand')}
                className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary   '
                placeholder='Enter brand'
              />
              {errors.brand && <InputErrorWrapper message={errors.brand.message || ''} />}
            </div>
            <div>
              <label className='block text-sm font-medium text-secondary-foreground mb-1'>
                Unit <span className='text-xs text-muted-foreground'>(optional)</span>
              </label>
              <input
                type='text'
                {...register('unit')}
                className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary   '
                placeholder='pcs, kg, lbs, etc.'
              />
              {errors.unit && <InputErrorWrapper message={errors.unit.message || ''} />}
            </div>
          </div>

          {/* Tax Rates */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-secondary-foreground mb-1'>
                Sales Tax Rate (%) <span className='text-xs text-muted-foreground'>(optional)</span>
              </label>
              <input
                type='number'
                step='0.01'
                min='0'
                max='100'
                {...register('salesTaxRate', { valueAsNumber: true })}
                className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary   '
                placeholder='0.00'
              />
              {errors.salesTaxRate && (
                <InputErrorWrapper message={errors.salesTaxRate.message || ''} />
              )}
            </div>

            <div className='w-full'>
              <label className='block text-sm font-medium text-secondary-foreground mb-1'>
                Purchase Tax Rate (%){' '}
                <span className='text-xs text-muted-foreground'>(optional)</span>
              </label>
              <input
                type='number'
                step='0.01'
                min='0'
                max='100'
                {...register('purchaseTaxRate', { valueAsNumber: true })}
                className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary   '
                placeholder='0.00'
              />
              {errors.purchaseTaxRate && (
                <InputErrorWrapper message={errors.purchaseTaxRate.message || ''} />
              )}
            </div>
            <div className='w-full'>
              <label className='block text-sm font-medium text-secondary-foreground mb-1'>
                Low Stock Alert Level{' '}
                <span className='text-xs text-muted-foreground'>(optional)</span>
              </label>
              <input
                type='number'
                min='0'
                {...register('lowStockAlert', { valueAsNumber: true })}
                className='w-full  px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary   '
                placeholder='0'
              />
              {errors.lowStockAlert && (
                <InputErrorWrapper message={errors.lowStockAlert.message || ''} />
              )}
            </div>
            <div className='w-full'>
              <label className='block text-sm font-medium text-secondary-foreground mb-1'>
                Current Stock <span className='text-xs text-muted-foreground'>(optional)</span>
              </label>
              <input
                type='number'
                min='0'
                {...register('currentStock', { valueAsNumber: true })}
                className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary   '
                placeholder='0'
              />
              {errors.currentStock && (
                <InputErrorWrapper message={errors.currentStock.message || ''} />
              )}
            </div>
          </div>

          {/* Supplier Information */}
          <div className='space-y-4'>
            <h3 className='text-lg font-medium text-foreground'>
              Supplier Information <span className='text-xs text-muted-foreground'>(optional)</span>
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-secondary-foreground mb-1'>
                  Primary Supplier <span className='text-xs text-muted-foreground'>(optional)</span>
                </label>
                <Select
                  // value={watch('supplierId') || undefined}
                  onValueChange={value => setValue('supplier', value === 'none' ? '' : value)}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select primary supplier' />
                  </SelectTrigger>
                  <SelectContent className='max-h-60 overflow-y-auto bg-white'>
                    {suppliers.map(supplier => (
                      <SelectItem key={supplier._id!} value={supplier._id!}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.supplier && <InputErrorWrapper message={errors.supplier.message || ''} />}
              </div>

              <div>
                <label className='block text-sm font-medium text-secondary-foreground mb-1'>
                  Alternative Suppliers{' '}
                  <span className='text-xs text-muted-foreground'>(optional)</span>
                </label>

                <MultiSelect
                  options={
                    suppliers?.map(supplier => ({
                      value: supplier._id!,
                      label: supplier.name,
                    })) || []
                  }
                  value={alternativeSuppliers}
                  // value={watch('alternativeSupplierIds') || []}
                  onValueChange={value => setValue('alternativeSuppliers', value)}
                  placeholder='Select alternative suppliers'
                  maxCount={3}
                  className='w-full bg-white'
                />
                <p className='text-sm text-muted-foreground mb-2'>
                  Backup suppliers for this product
                </p>
                {errors.alternativeSuppliers && (
                  <InputErrorWrapper message={errors.alternativeSuppliers.message || ''} />
                )}
              </div>
            </div>
          </div>

          {/* Inventory Settings */}
          <div className='space-y-4'>
            <h3 className='text-lg font-medium text-foreground'>
              Inventory Settings <span className='text-xs text-muted-foreground'>(optional)</span>
            </h3>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='flex items-center'>
              <input
                type='checkbox'
                {...register('trackInventory')}
                className='h-4 w-4 text-primary focus:ring-primary border-border rounded'
              />
              <label className='ml-2 block text-sm text-foreground '>Track Inventory</label>
            </div>

            <div className='flex items-center'>
              <input
                type='checkbox'
                {...register('trackSerialNumber')}
                className='h-4 w-4 text-primary focus:ring-primary border-border rounded'
              />
              <label className='ml-2 block text-sm text-foreground '>Track Serial Numbers</label>
            </div>

            <div className='flex items-center'>
              <input
                type='checkbox'
                {...register('trackExpiryDate')}
                className='h-4 w-4 text-primary focus:ring-primary border-border rounded'
              />
              <label className='ml-2 block text-sm text-foreground '>Track Expiry Dates</label>
            </div>

            {/* Conditional Expiry Date Input */}
            {/* {watch('trackExpiryDate') && (
                            <div>
                                <label className="block text-sm font-medium text-secondary-foreground mb-1">
                                    Expiry Date <span className="text-xs text-muted-foreground">(optional)</span>
                                </label>
                                <input
                                    type="date"
                                    {...register('expiryDate')}
                                    className="w-full md:w-1/3 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary    dark:[color-scheme:dark]"
                                />
                                {errors.expiryDate && <InputErrorWrapper message={errors.expiryDate.message || ''} />}
                            </div>
                        )} */}
          </div>

          {/* Status */}
          <div className='flex items-center'>
            <input
              type='checkbox'
              {...register('isActive')}
              className='h-4 w-4 text-primary focus:ring-primary border-border rounded'
            />
            <label className='ml-2 block text-sm text-foreground '>Product is Active</label>
          </div>

          {/* Form Actions */}
          <div className='flex items-center justify-end space-x-4 pt-6'>
            <button
              type='button'
              onClick={handleCancel}
              className='px-4 py-2 text-secondary-foreground bg-muted rounded-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary   hover:bg-accent'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className='px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50'
            >
              {isSubmitting ? 'Saving...' : product?._id ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}

export default ProductForm
