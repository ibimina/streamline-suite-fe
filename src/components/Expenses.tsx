'use client'
import React, { useState } from 'react'
import { Expense, ExpenseCategory, EXPENSE_CATEGORIES } from '../types'
import { PencilIcon, TrashIcon, XIcon, PlusIcon } from './Icons'
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

// Mock Data
const mockExpenses: Expense[] = [
  {
    id: 'exp-1',
    date: '2024-07-22',
    category: 'Utilities',
    description: 'Monthly Electricity Bill',
    amount: 150.75,
  },
  {
    id: 'exp-2',
    date: '2024-07-20',
    category: 'Supplies',
    description: 'Office stationery',
    amount: 45.5,
  },
  {
    id: 'exp-3',
    date: '2024-07-18',
    category: 'Delivery',
    description: 'Courier for urgent documents',
    amount: 25.0,
  },
  {
    id: 'exp-4',
    date: '2024-07-15',
    category: 'Rent',
    description: 'Office Rent - July',
    amount: 2500.0,
  },
  {
    id: 'exp-5',
    date: '2024-07-10',
    category: 'Marketing',
    description: 'Social Media Campaign',
    amount: 300.0,
  },
]

const monthlyExpenseData = [
  { name: 'Jan', Expenses: 2400 },
  { name: 'Feb', Expenses: 2210 },
  { name: 'Mar', Expenses: 2290 },
  { name: 'Apr', Expenses: 2000 },
  { name: 'May', Expenses: 2181 },
  { name: 'Jun', Expenses: 2500 },
  { name: 'Jul', Expenses: 3021.25 },
]

const Expenses: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses)
  const [isModalOpen, setModalOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null)

  const handleOpenModal = (expense: Expense | null = null) => {
    setEditingExpense(expense)
    setModalOpen(true)
  }

  const handleSave = (expense: Expense) => {
    if (editingExpense) {
      setExpenses(expenses.map(e => (e.id === expense.id ? expense : e)))
    } else {
      setExpenses([{ ...expense, id: `exp-${Date.now()}` }, ...expenses])
    }
    setModalOpen(false)
    setEditingExpense(null)
  }

  const openDeleteModal = (expense: Expense) => {
    setDeletingExpense(expense)
    setDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (deletingExpense) {
      setExpenses(expenses.filter(e => e.id !== deletingExpense.id))
      setDeleteModalOpen(false)
      setDeletingExpense(null)
    }
  }

  const totalThisMonth = expenses
    .filter(e => new Date(e.date).getMonth() === new Date().getMonth())
    .reduce((sum, e) => sum + e.amount, 0)
  const totalYTD = expenses
    .filter(e => new Date(e.date).getFullYear() === new Date().getFullYear())
    .reduce((sum, e) => sum + e.amount, 0)

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>Expense Tracking</h1>
        <p className='text-gray-500 dark:text-gray-400 mt-1'>
          Record and analyze your company&apos;s expenses.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg'>
          <p className='text-gray-500 dark:text-gray-400 font-medium'>
            Total Expenses (This Month)
          </p>
          <p className='text-3xl font-bold text-gray-900 dark:text-white mt-2'>
            ${totalThisMonth.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg'>
          <p className='text-gray-500 dark:text-gray-400 font-medium'>Total Expenses (YTD)</p>
          <p className='text-3xl font-bold text-gray-900 dark:text-white mt-2'>
            ${totalYTD.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
          Monthly Expenses
        </h3>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={monthlyExpenseData}>
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

      <div className='flex justify-end'>
        <button
          onClick={() => handleOpenModal()}
          className='bg-teal-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors flex items-center'
        >
          <PlusIcon className='w-5 h-5 mr-2' /> Add New Expense
        </button>
      </div>

      <div className='bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg overflow-x-auto'>
        <table className='w-full text-sm text-left'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
            <tr>
              <th className='px-6 py-3'>Date</th>
              <th className='px-6 py-3'>Category</th>
              <th className='px-6 py-3'>Description</th>
              <th className='px-6 py-3 text-right'>Amount</th>
              <th className='px-6 py-3 text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(exp => (
              <tr
                key={exp.id}
                className='border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
              >
                <td className='px-6 py-4'>{exp.date}</td>
                <td className='px-6 py-4'>
                  <span className='px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200'>
                    {exp.category}
                  </span>
                </td>
                <td className='px-6 py-4'>{exp.description}</td>
                <td className='px-6 py-4 text-right font-semibold'>
                  ${exp.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td className='px-6 py-4 text-center'>
                  <button
                    onClick={() => handleOpenModal(exp)}
                    className='p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700'
                    title='Edit Expense'
                  >
                    <PencilIcon className='w-5 h-5 text-gray-500' />
                  </button>
                  <button
                    onClick={() => openDeleteModal(exp)}
                    className='p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700'
                    title='Delete Expense'
                  >
                    <TrashIcon className='w-5 h-5 text-red-500' />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <ExpenseModal
          expense={editingExpense}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          onConfirm={confirmDelete}
          onCancel={() => setDeleteModalOpen(false)}
        />
      )}
    </div>
  )
}

const ExpenseModal: React.FC<{
  expense: Expense | null
  onSave: (expense: Expense) => void
  onClose: () => void
}> = ({ expense, onSave, onClose }) => {
  const [formData, setFormData] = useState<Omit<Expense, 'id'>>(
    expense || {
      date: new Date().toISOString().split('T')[0],
      category: 'Other',
      description: '',
      amount: 0,
    }
  )

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: name === 'amount' ? Number(value) : value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ ...(expense || { id: '' }), ...formData })
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-bold'>{expense ? 'Edit' : 'Add New'} Expense</h2>
          <button onClick={onClose}>
            <XIcon className='w-6 h-6' />
          </button>
        </div>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <input
              type='date'
              name='date'
              value={formData.date}
              onChange={handleChange}
              required
              className='p-2 border rounded dark:bg-gray-700 dark:border-gray-600'
            />
            <select
              name='category'
              value={formData.category}
              onChange={handleChange}
              className='p-2 border rounded dark:bg-gray-700 dark:border-gray-600'
            >
              {EXPENSE_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <textarea
            name='description'
            placeholder='Description'
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className='p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600'
          />
          <input
            type='number'
            name='amount'
            placeholder='Amount'
            value={formData.amount}
            onChange={handleChange}
            required
            className='p-2 border rounded dark:bg-gray-700 dark:border-gray-600'
          />
          <div className='flex justify-end pt-4'>
            <button
              type='button'
              onClick={onClose}
              className='mr-2 px-4 py-2 rounded bg-gray-200 dark:bg-gray-600'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 rounded bg-teal-500 text-white hover:bg-teal-600'
            >
              Save Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const DeleteConfirmationModal: React.FC<{ onConfirm: () => void; onCancel: () => void }> = ({
  onConfirm,
  onCancel,
}) => (
  <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm'>
      <h3 className='text-lg font-bold mb-2'>Confirm Deletion</h3>
      <p className='text-gray-600 dark:text-gray-400 mb-4'>
        Are you sure? This action cannot be undone.
      </p>
      <div className='flex justify-end'>
        <button onClick={onCancel} className='mr-2 px-4 py-2 rounded bg-gray-200 dark:bg-gray-600'>
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className='px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700'
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)

export default Expenses
