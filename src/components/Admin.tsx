'use client'
import React, { useState } from 'react'
import { PencilIcon, TrashIcon, XIcon } from './Icons'
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from '@/store/api'
import { User, UserFormData, UserRole } from '@/types/user.type'
import DeleteConfirmationModal from './shared/DeleteConfirmationModal'
import { Paginator } from './ui/pagination'

type RoleOption = { value: UserRole; label: string }

const Admin: React.FC = () => {
  const [page, setPage] = useState(1)
  const limit = 10

  // RTK Query hooks
  const { data: usersData, isLoading, isError, refetch } = useGetUsersQuery({ page, limit })
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation()
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation()
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation()

  const [isModalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)

  const users = usersData?.payload.data || []

  const handleOpenModal = (user: User | null = null) => {
    setEditingUser(user)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setEditingUser(null)
    setModalOpen(false)
  }

  const handleSave = async (formData: UserFormData) => {
    try {
      if (editingUser) {
        await updateUser({ userId: editingUser._id, data: formData }).unwrap()
      } else {
        await createUser(formData).unwrap()
      }
      handleCloseModal()
    } catch (error) {
      console.error('Failed to save user:', error)
    }
  }

  const openDeleteModal = (user: User) => {
    setDeletingUser(user)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (deletingUser) {
      try {
        await deleteUser(deletingUser._id).unwrap()
        setDeleteModalOpen(false)
        setDeletingUser(null)
      } catch (error) {
        console.error('Failed to delete user:', error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className='text-center py-12'>
        <p className='text-red-500 mb-4'>Failed to load users</p>
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
        <h1 className='text-3xl font-bold text-foreground'>Admin Panel: User Management</h1>
        <p className='text-muted-foreground mt-1'>
          Add, edit, and manage user roles and permissions.
        </p>
      </div>
      <div className='flex justify-end'>
        <button
          onClick={() => handleOpenModal()}
          className='bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary transition-colors'
        >
          Add New User
        </button>
      </div>
      <div className='bg-card p-4 rounded-xl shadow-lg overflow-x-auto'>
        <table className='w-full text-sm text-left'>
          <thead className='text-xs text-secondary-foreground uppercase bg-muted dark:text-muted-foreground'>
            <tr>
              <th className='px-6 py-3'>User</th>
              <th className='px-6 py-3'>Role</th>
              <th className='px-6 py-3'>Status</th>
              <th className='px-6 py-3'>Last Login</th>
              <th className='px-6 py-3 text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className='px-6 py-12 text-center text-muted-foreground'>
                  No users found. Add your first user to get started.
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user._id} className='border-b border-border hover:bg-muted '>
                  <td className='px-6 py-4'>
                    <div className='font-medium text-foreground'>
                      {user.firstName} {user.lastName}
                    </div>
                    <div className='text-xs text-muted-foreground'>{user.email}</div>
                  </td>
                  <td className='px-6 py-4'>
                    <span className='px-2 py-1 text-xs font-semibold rounded-full bg-muted text-foreground   capitalize'>
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className='px-6 py-4'>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                        user.isActive
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}
                    >
                      {user.isActive ? 'Active' : 'In active'}
                    </span>
                  </td>
                  <td className='px-6 py-4'>
                    {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never'}
                  </td>
                  <td className='px-6 py-4 text-center'>
                    <button
                      onClick={() => handleOpenModal(user)}
                      className='p-2 rounded-full hover:bg-muted '
                      title='Edit User'
                      disabled={isUpdating}
                    >
                      <PencilIcon className='w-5 h-5 text-muted-foreground' />
                    </button>
                    <button
                      onClick={() => openDeleteModal(user)}
                      className='p-2 rounded-full hover:bg-muted '
                      title='Delete User'
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
        {usersData?.payload?.total && usersData.payload.total > limit && (
          <div className='flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 pt-4 border-t border-border'>
            <p className='text-sm text-muted-foreground'>
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, usersData.payload.total)}{' '}
              of {usersData.payload.total} users
            </p>
            <Paginator
              currentPage={page}
              totalPages={Math.ceil(usersData.payload.total / limit)}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
      {isModalOpen && (
        <UserModal
          user={editingUser}
          onSave={handleSave}
          onClose={handleCloseModal}
          isLoading={isCreating || isUpdating}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          onConfirm={confirmDelete}
          onCancel={() => setDeleteModalOpen(false)}
          isLoading={isDeleting}
          open={isDeleteModalOpen}
        />
      )}
    </div>
  )
}

const UserModal: React.FC<{
  user: User | null
  onSave: (formData: UserFormData) => void
  onClose: () => void
  isLoading?: boolean
}> = ({ user, onSave, onClose, isLoading }) => {
  const [formData, setFormData] = useState<UserFormData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || 'staff',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Only include password if it's a new user or if password was changed
    const dataToSave = { ...formData }
    if (user && !formData.password) {
      delete dataToSave.password
    }
    onSave(dataToSave)
  }

  const roleOptions: RoleOption[] = [
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
    { value: 'staff', label: 'Staff' },
    { value: 'accountant', label: 'Accountant' },
    { value: 'sales_rep', label: 'Sales Rep' },
  ]

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
      <div className='bg-card rounded-lg shadow-xl p-6 w-full max-w-lg'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-bold'>{user ? 'Edit' : 'Add New'} User</h2>
          <button onClick={onClose}>
            <XIcon className='w-6 h-6' />
          </button>
        </div>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-secondary-foreground'>
                First Name
              </label>
              <input
                type='text'
                name='firstName'
                placeholder='First Name'
                value={formData.firstName}
                onChange={handleChange}
                required
                className='mt-1 p-2 w-full border rounded  '
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-secondary-foreground'>
                Last Name
              </label>
              <input
                type='text'
                name='lastName'
                placeholder='Last Name'
                value={formData.lastName}
                onChange={handleChange}
                required
                className='mt-1 p-2 w-full border rounded  '
              />
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-secondary-foreground'>Email</label>
              <input
                type='email'
                name='email'
                placeholder='Email'
                value={formData.email}
                onChange={handleChange}
                required
                className='mt-1 p-2 w-full border rounded  '
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-secondary-foreground'>Phone</label>
              <input
                type='tel'
                name='phone'
                placeholder='Phone'
                value={formData.phone}
                onChange={handleChange}
                className='mt-1 p-2 w-full border rounded  '
              />
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium text-secondary-foreground'>Role</label>
            <select
              name='role'
              value={formData.role}
              onChange={handleChange}
              className='mt-1 p-2 w-full border rounded  '
            >
              {roleOptions.map(role => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium text-secondary-foreground'>Password</label>
            <input
              type='password'
              name='password'
              placeholder={user ? 'Leave blank to keep unchanged' : 'Password'}
              value={formData.password}
              onChange={handleChange}
              required={!user}
              className='mt-1 p-2 w-full border rounded  '
            />
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
              {isLoading ? 'Saving...' : 'Save User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Admin
