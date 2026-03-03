'use client'
import React, { useState, useCallback } from 'react'
import { useForm, useFieldArray, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DateRange } from 'react-day-picker'
import { EXPENSE_CATEGORIES } from '../../types'
import { PencilIcon, TrashIcon, XIcon, PlusIcon } from '../Icons'
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import {
  useGetExpensesQuery,
  useGetExpenseStatsQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useGetProductsQuery,
  useGetSuppliersQuery,
  useUpdateExpenseStatusMutation,
} from '@/store/api'
import { useCurrency } from '@/hooks/useCurrency'
import {
  Expense,
  ExpenseFormData,
  ExpenseStatus,
  ExpenseCategory,
  ExpenseItem,
} from '@/types/expense.type'
import {
  expenseSchema,
  type ExpenseFormData as ExpenseSchemaFormData,
} from '@/schemas/expense.schema'
import LoadingSpinner from '../shared/LoadingSpinner'
import InputErrorWrapper from '../shared/InputErrorWrapper'
import { FilterBar, FilterOption } from '../shared/FilterBar'
import DeleteConfirmationModal from '../shared/DeleteConfirmationModal'
import { Paginator } from '../ui/pagination'

// Status filter options
const STATUS_OPTIONS: FilterOption[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
]

// Category filter options
const CATEGORY_OPTIONS: FilterOption[] = EXPENSE_CATEGORIES.map(cat => ({
  value: cat,
  label: cat,
}))

const Expenses: React.FC = () => {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [statusFilter, setStatusFilter] = useState<ExpenseStatus | 'all'>('all')
  const [categoryFilter, setCategoryFilter] = useState<ExpenseCategory | 'all'>('all')
  const limit = 10

  // RTK Query hooks
  const {
    data: expensesData,
    isLoading,
    isError,
    refetch,
  } = useGetExpensesQuery({
    page,
    limit,
    search: searchTerm || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    category: categoryFilter !== 'all' ? categoryFilter : undefined,
    startDate: dateRange?.from?.toISOString(),
    endDate: dateRange?.to?.toISOString(),
  })
  const { data: statsData } = useGetExpenseStatsQuery()
  const { formatCurrency } = useCurrency()
  const [createExpense, { isLoading: isCreating }] = useCreateExpenseMutation()
  const [updateExpense, { isLoading: isUpdating }] = useUpdateExpenseMutation()
  const [deleteExpense, { isLoading: isDeleting }] = useDeleteExpenseMutation()
  const [updateExpenseStatus] = useUpdateExpenseStatusMutation()

  const [isModalOpen, setModalOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)

  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null)

  // Wrapper handlers that reset page when filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setPage(1)
  }
  const handleStatusChange = (value: string) => {
    setStatusFilter(value as ExpenseStatus | 'all')
    setPage(1)
  }

  const handleExpenseStatusChange = async (expenseId: string, newStatus: ExpenseStatus) => {
    try {
      await updateExpenseStatus({ expenseId, status: newStatus }).unwrap()
    } catch (error) {
      console.error('Failed to update expense status:', error)
    }
  }
  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value as ExpenseCategory | 'all')
    setPage(1)
  }
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range)
    setPage(1)
  }

  const expenses = expensesData?.payload?.data || []
  const stats = statsData?.payload

  const handleOpenModal = (expense: Expense | null = null) => {
    setEditingExpense(expense)
    setModalOpen(true)
  }

  const handleSave = async (expenseData: ExpenseFormData) => {
    try {
      if (editingExpense) {
        await updateExpense({ expenseId: editingExpense._id, data: expenseData }).unwrap()
      } else {
        await createExpense(expenseData).unwrap()
      }
      setModalOpen(false)
      setEditingExpense(null)
    } catch (error) {
      console.error('Failed to save expense:', error)
    }
  }

  const openDeleteModal = (expense: Expense) => {
    setDeletingExpense(expense)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (deletingExpense) {
      try {
        await deleteExpense(deletingExpense._id).unwrap()
        setDeleteModalOpen(false)
        setDeletingExpense(null)
      } catch (error) {
        console.error('Failed to delete expense:', error)
      }
    }
  }

  const totalAmount = stats?.totalAmount || 0
  const pendingAmount = stats?.pending?.amount || 0
  const approvedAmount = stats?.approved?.amount || 0
  const monthlyTrendData = (stats?.monthlyTrend || []).map((item: any) => ({
    name: item.month,
    Expenses: item.amount,
  }))

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isError) {
    return (
      <div className='text-center py-12'>
        <p className='text-red-500 mb-4'>Failed to load expenses</p>
        <button
          onClick={() => refetch()}
          className='bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary'
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold text-foreground'>Expense Tracking</h1>
        <p className='text-muted-foreground mt-1'>
          Record and analyze your company&apos;s expenses.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-card p-6 rounded-xl shadow-lg'>
          <p className='text-muted-foreground font-medium'>Total Expenses</p>
          <p className='text-3xl font-bold text-foreground mt-2'>{formatCurrency(totalAmount)}</p>
        </div>
        <div className='bg-card p-6 rounded-xl shadow-lg'>
          <p className='text-muted-foreground font-medium'>Pending Approval</p>
          <p className='text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-2'>
            {formatCurrency(pendingAmount)}
          </p>
        </div>
        <div className='bg-card p-6 rounded-xl shadow-lg'>
          <p className='text-muted-foreground font-medium'>Approved</p>
          <p className='text-3xl font-bold text-green-600 dark:text-green-400 mt-2'>
            {formatCurrency(approvedAmount)}
          </p>
        </div>
      </div>

      <div className='bg-card p-6 rounded-xl shadow-lg'>
        <h3 className='text-lg font-semibold text-foreground mb-4'>Monthly Expenses</h3>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={monthlyTrendData}>
            <CartesianGrid strokeDasharray='3 3' stroke='#4B5563' />
            <XAxis dataKey='name' stroke='#6B7280' />
            <YAxis stroke='#6B7280' />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
              itemStyle={{ color: '#E5E7EB' }}
              cursor={{ fill: 'rgba(107, 114, 128, 0.2)' }}
            />
            <Legend wrapperStyle={{ color: '#E5E7EB' }} />
            <Bar dataKey='Expenses' fill='#DC2626' />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filters and Add Button */}
      <div className='flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center'>
        <FilterBar
          searchValue={searchTerm}
          onSearchChange={handleSearchChange}
          searchPlaceholder='Search expenses...'
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          statusValue={statusFilter}
          onStatusChange={handleStatusChange}
          statusOptions={STATUS_OPTIONS}
          statusPlaceholder='All Status'
          secondaryValue={categoryFilter}
          onSecondaryChange={handleCategoryChange}
          secondaryOptions={CATEGORY_OPTIONS}
          secondaryPlaceholder='All Categories'
          showSecondary={true}
        />
        <button
          onClick={() => handleOpenModal()}
          className='bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center whitespace-nowrap'
        >
          <PlusIcon className='w-5 h-5 mr-2' /> Add New Expense
        </button>
      </div>

      <div className='bg-card p-4 rounded-xl shadow-lg overflow-x-auto'>
        <table className='w-full text-sm text-left'>
          <thead className='text-xs text-secondary-foreground uppercase bg-muted dark:text-muted-foreground'>
            <tr>
              <th className='px-6 py-3'>Date</th>
              <th className='px-6 py-3'>Category</th>
              <th className='px-6 py-3'>Description</th>
              <th className='px-6 py-3'>Items</th>
              <th className='px-6 py-3'>Status</th>
              <th className='px-6 py-3 text-right'>Amount</th>
              <th className='px-6 py-3 text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 ? (
              <tr>
                <td colSpan={7} className='px-6 py-12 text-center text-muted-foreground'>
                  No expenses found. Add your first expense to get started.
                </td>
              </tr>
            ) : (
              expenses.map(exp => (
                <tr key={exp._id} className='border-b border-border hover:bg-muted '>
                  <td className='px-6 py-4'>{new Date(exp.date).toLocaleDateString()}</td>
                  <td className='px-6 py-4'>
                    <span className='px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200'>
                      {exp.category
                        .replace(/_/g, ' ')
                        .replace(/\b\w/g, (c: string) => c.toUpperCase())}
                    </span>
                  </td>
                  <td className='px-6 py-4'>{exp.description}</td>
                  <td className='px-6 py-4'>
                    {exp.items && exp.items.length > 0 ? (
                      <span className='px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'>
                        {exp.items.length} item{exp.items.length > 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className='text-muted-foreground text-xs'>—</span>
                    )}
                  </td>
                  <td className='px-6 py-4'>
                    <select
                      value={exp.status}
                      onChange={e =>
                        handleExpenseStatusChange(exp._id, e.target.value as ExpenseStatus)
                      }
                      className={`px-2 py-1 text-xs font-medium rounded-full capitalize border-0 cursor-pointer focus:ring-2 focus:ring-primary appearance-none ${
                        exp.status === 'approved'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : exp.status === 'rejected'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : exp.status === 'paid'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : exp.status === 'cancelled'
                                ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}
                    >
                      <option value='pending'>Pending</option>
                      <option value='approved'>Approved</option>
                      <option value='rejected'>Rejected</option>
                      <option value='paid'>Paid</option>
                      <option value='cancelled'>Cancelled</option>
                    </select>
                  </td>
                  <td className='px-6 py-4 text-right font-semibold'>
                    {formatCurrency(exp.amount)}
                  </td>
                  <td className='px-6 py-4 text-center'>
                    <button
                      onClick={() => handleOpenModal(exp)}
                      className='p-2 rounded-full hover:bg-muted '
                      title='Edit Expense'
                      disabled={isUpdating}
                    >
                      <PencilIcon className='w-5 h-5 text-muted-foreground' />
                    </button>
                    <button
                      onClick={() => openDeleteModal(exp)}
                      className='p-2 rounded-full hover:bg-muted '
                      title='Delete Expense'
                      disabled={isDeleting}
                    >
                      <TrashIcon className='w-5 h-5 text-red-500' />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {expensesData?.payload?.total && expensesData.payload.total > limit && (
          <div className='flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 pt-4 border-t border-border'>
            <p className='text-sm text-muted-foreground'>
              Showing {(page - 1) * limit + 1} to{' '}
              {Math.min(page * limit, expensesData.payload.total)} of {expensesData.payload.total}{' '}
              expenses
            </p>
            <Paginator
              currentPage={page}
              totalPages={Math.ceil(expensesData.payload.total / limit)}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
      {isModalOpen && (
        <ExpenseModal
          expense={editingExpense}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
          isLoading={isCreating || isUpdating}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          onConfirm={confirmDelete}
          onCancel={() => setDeleteModalOpen(false)}
          open={isDeleteModalOpen}
        />
      )}
    </div>
  )
}

const ExpenseModal: React.FC<{
  expense: Expense | null
  onSave: (expense: ExpenseFormData) => void
  onClose: () => void
  isLoading?: boolean
}> = ({ expense, onSave, onClose, isLoading }) => {
  const { formatCurrency } = useCurrency()
  const [showItems, setShowItems] = useState(!!(expense?.items && expense.items.length > 0))

  const { data: productsData } = useGetProductsQuery({ limit: 200 })
  const products = productsData?.payload?.products || []

  const { data: suppliersData } = useGetSuppliersQuery()
  const suppliers = suppliersData?.payload?.suppliers || []

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: expense?.date
        ? new Date(expense.date).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      category: expense?.category || 'other',
      description: expense?.description || '',
      amount: expense?.amount || 0,
      paymentMethod: expense?.paymentMethod || 'cash',
      vendor: expense?.vendor
        ? typeof expense.vendor === 'object'
          ? expense.vendor._id
          : expense.vendor
        : '',
      reference: expense?.reference || '',
      notes: expense?.notes || '',
      items: (expense?.items || []).map((item: ExpenseItem) => ({
        product: typeof item.product === 'object' ? item.product?._id || '' : item.product || '',
        description: item.description || '',
        quantity: item.quantity || 1,
        unitCost: item.unitCost || 0,
      })),
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  const watchedItems = useWatch({ control, name: 'items' }) || []
  const itemsTotal = watchedItems.reduce(
    (sum: number, item: any) => sum + (Number(item?.quantity) || 0) * (Number(item?.unitCost) || 0),
    0
  )

  // Auto-update amount from items when items section is shown
  const handleAutoAmount = useCallback(() => {
    if (showItems && watchedItems.length > 0 && itemsTotal > 0) {
      setValue('amount', itemsTotal)
    }
  }, [showItems, watchedItems.length, itemsTotal, setValue])

  React.useEffect(() => {
    handleAutoAmount()
  }, [handleAutoAmount])

  const onSubmit = (data: any) => {
    const formData = { ...data } as ExpenseFormData
    // Strip empty optional string fields so backend doesn't validate them as MongoId
    if (!formData.vendor) delete formData.vendor
    if (!formData.reference) delete formData.reference
    // Only include items if the section is open and items exist
    if (!showItems || !formData.items || formData.items.length === 0) {
      formData.items = undefined
    } else {
      // Filter out empty items (no description)
      formData.items = formData.items.filter((item: any) => item.description?.trim())
    }
    onSave(formData)
  }

  return (
    <div className='fixed inset-0 bg-black/20  flex justify-center items-center z-50'>
      <div className='bg-card rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-bold'>{expense ? 'Edit' : 'Add New'} Expense</h2>
          <button onClick={onClose}>
            <XIcon className='w-6 h-6' />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <input type='date' {...register('date')} className='p-2 w-full border rounded  ' />
              {errors.date && <InputErrorWrapper message={errors.date.message || ''} />}
            </div>
            <div>
              <select {...register('category')} className='p-2 w-full border rounded  '>
                {EXPENSE_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  </option>
                ))}
              </select>
              {errors.category && <InputErrorWrapper message={errors.category.message || ''} />}
            </div>
          </div>
          <div>
            <select {...register('vendor')} className='p-2 w-full border rounded  '>
              <option value=''>Select Supplier (optional)</option>
              {suppliers.map((s: any) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
            {errors.vendor && <InputErrorWrapper message={errors.vendor.message || ''} />}
          </div>
          <div>
            <textarea
              {...register('description')}
              placeholder='Description'
              rows={3}
              className='p-2 w-full border rounded  '
            />
            {errors.description && <InputErrorWrapper message={errors.description.message || ''} />}
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <input
                type='number'
                step='0.01'
                {...register('amount', { valueAsNumber: true })}
                placeholder='Amount'
                className='p-2 w-full border rounded  '
                readOnly={showItems && watchedItems.length > 0}
              />
              {showItems && watchedItems.length > 0 && (
                <p className='text-xs text-muted-foreground mt-1'>Auto-calculated from items</p>
              )}
              {errors.amount && <InputErrorWrapper message={errors.amount.message || ''} />}
            </div>
            <div>
              <select {...register('paymentMethod')} className='p-2 w-full border rounded  '>
                <option value='cash'>Cash</option>
                <option value='bank_transfer'>Bank Transfer</option>
                <option value='credit_card'>Credit Card</option>
                <option value='debit_card'>Debit Card</option>
                <option value='cheque'>Cheque</option>
              </select>
              {errors.paymentMethod && (
                <InputErrorWrapper message={errors.paymentMethod.message || ''} />
              )}
            </div>
          </div>
          <div>
            <input
              type='text'
              {...register('reference')}
              placeholder='Reference Number (optional)'
              className='p-2 w-full border rounded  '
            />
            {errors.reference && <InputErrorWrapper message={errors.reference.message || ''} />}
          </div>

          {/* Product Items Section */}
          <div className='border border-border rounded-lg'>
            <button
              type='button'
              onClick={() => setShowItems(!showItems)}
              className='w-full flex items-center justify-between p-3 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors'
            >
              <span>Product Items (for stock purchases)</span>
              <span className='text-muted-foreground text-xs'>
                {showItems ? '▼ Hide' : '▶ Show'}
              </span>
            </button>

            {showItems && (
              <div className='px-3 pb-3 space-y-3'>
                {fields.length === 0 && (
                  <p className='text-xs text-muted-foreground py-2'>
                    No items added. Click below to add product line items.
                  </p>
                )}

                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className='grid grid-cols-12 gap-2 items-start bg-muted/50 p-2 rounded'
                  >
                    <div className='col-span-4'>
                      <select
                        {...register(`items.${index}.product`)}
                        className='p-1.5 w-full border rounded text-xs'
                      >
                        <option value=''>No product</option>
                        {(products as any[]).map((p: any) => (
                          <option key={p._id} value={p._id}>
                            {p.name} ({p.sku})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className='col-span-3'>
                      <input
                        type='text'
                        {...register(`items.${index}.description`)}
                        placeholder='Description'
                        className='p-1.5 w-full border rounded text-xs'
                      />
                      {errors.items?.[index]?.description && (
                        <InputErrorWrapper
                          message={errors.items[index].description?.message || ''}
                        />
                      )}
                    </div>
                    <div className='col-span-2'>
                      <input
                        type='number'
                        min='1'
                        {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                        placeholder='Qty'
                        className='p-1.5 w-full border rounded text-xs'
                      />
                    </div>
                    <div className='col-span-2'>
                      <input
                        type='number'
                        step='0.01'
                        min='0'
                        {...register(`items.${index}.unitCost`, { valueAsNumber: true })}
                        placeholder='Unit Cost'
                        className='p-1.5 w-full border rounded text-xs'
                      />
                    </div>
                    <div className='col-span-1 flex items-center justify-center'>
                      <button
                        type='button'
                        onClick={() => remove(index)}
                        className='p-1 rounded hover:bg-red-100 dark:hover:bg-red-900'
                        title='Remove item'
                      >
                        <TrashIcon className='w-4 h-4 text-red-500' />
                      </button>
                    </div>
                  </div>
                ))}

                {fields.length > 0 && (
                  <div className='flex justify-end text-sm font-medium text-foreground pr-10'>
                    Items Total: {formatCurrency(itemsTotal)}
                  </div>
                )}

                <button
                  type='button'
                  onClick={() => append({ product: '', description: '', quantity: 1, unitCost: 0 })}
                  className='flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium'
                >
                  <PlusIcon className='w-4 h-4' /> Add Item
                </button>
              </div>
            )}
          </div>

          <div className='flex justify-end pt-4'>
            <button
              type='button'
              onClick={onClose}
              className='mr-2 px-4 py-2 rounded bg-muted'
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 rounded bg-primary text-white hover:bg-primary disabled:opacity-50'
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Expenses
