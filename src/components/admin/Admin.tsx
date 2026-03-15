'use client'
import React, { useState } from 'react'
import { PencilIcon, TrashIcon, XIcon } from '../Icons'
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from '@/store/api'
import { User, UserFormData, UserRole } from '@/types/user.type'
import DeleteConfirmationModal from '../shared/DeleteConfirmationModal'
import { Paginator } from '../ui/pagination'
import LoadingSpinner from '../shared/LoadingSpinner'
import ErrorPage from '../shared/ErrorPage'
import UserModal from './UserModal'
import { PermissionGate } from '../common/PermissionGate'
import { PermissionName } from '@/contants/permissions'

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
    return <LoadingSpinner />
  }

  if (isError) {
    return <ErrorPage errorMessage={'Failed to load users'} refetch={refetch} />
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
        <PermissionGate permissions={[PermissionName.MANAGE_USERS]}>
          <button
            onClick={() => handleOpenModal()}
            className='bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary transition-colors'
          >
            Add New User
          </button>
        </PermissionGate>
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
                    <PermissionGate permissions={[PermissionName.MANAGE_USERS]}>
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
                    </PermissionGate>
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
          isOpen={isModalOpen}
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

export default Admin
