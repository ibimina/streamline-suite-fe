'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ROLES } from '../../types'
import { PencilIcon, TrashIcon, XIcon, MailIcon, PhoneIcon, CurrencyDollarIcon } from '../Icons'
import Image from 'next/image'
import {
  useGetStaffQuery,
  useCreateStaffMutation,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
} from '@/store/api'
import { Staff as StaffType, StaffFormData } from '@/types/staff.type'
import {
  createStaffSchema,
  updateStaffSchema,
  type CreateStaffFormData,
  type UpdateStaffFormData,
} from '@/schemas/staff.schema'
import LoadingSpinner from '../shared/LoadingSpinner'
import InputErrorWrapper from '../shared/InputErrorWrapper'

const Staff: React.FC = () => {
  const [page, setPage] = useState(1)
  const limit = 12

  // RTK Query hooks
  const { data: staffData, isLoading, isError, refetch } = useGetStaffQuery({ page, limit })
  const [createStaff, { isLoading: isCreating }] = useCreateStaffMutation()
  const [updateStaff, { isLoading: isUpdating }] = useUpdateStaffMutation()
  const [deleteStaff, { isLoading: isDeleting }] = useDeleteStaffMutation()

  const [isModalOpen, setModalOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<StaffType | null>(null)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deletingStaff, setDeletingStaff] = useState<StaffType | null>(null)

  const staff = staffData?.payload?.data || []

  const handleOpenModal = (staffMember: StaffType | null = null) => {
    setEditingStaff(staffMember)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setEditingStaff(null)
    setModalOpen(false)
  }

  const handleSave = async (staffFormData: StaffFormData) => {
    try {
      if (editingStaff) {
        await updateStaff({ staffId: editingStaff._id, data: staffFormData }).unwrap()
      } else {
        await createStaff(staffFormData).unwrap()
      }
      handleCloseModal()
    } catch (error) {
      console.error('Failed to save staff:', error)
    }
  }

  const openDeleteModal = (member: StaffType) => {
    setDeletingStaff(member)
    setDeleteModalOpen(true)
  }

  const handleDelete = async () => {
    if (deletingStaff) {
      try {
        await deleteStaff(deletingStaff._id).unwrap()
        setDeleteModalOpen(false)
        setDeletingStaff(null)
      } catch (error) {
        console.error('Failed to delete staff:', error)
      }
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isError) {
    return (
      <div className='text-center py-12'>
        <p className='text-red-500 mb-4'>Failed to load staff</p>
        <button
          onClick={() => refetch()}
          className='bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600'
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>Staff Management</h1>
        <p className='text-gray-500 dark:text-gray-400 mt-1'>
          Manage all your employee and staff records.
        </p>
      </div>
      <div className='flex justify-end'>
        <button
          onClick={() => handleOpenModal()}
          className='bg-teal-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors'
        >
          Add New Staff
        </button>
      </div>
      {staff.length === 0 ? (
        <div className='text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg'>
          <p className='text-gray-500 dark:text-gray-400'>
            No staff members found. Add your first staff member to get started.
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {staff.map(member => (
            <div
              key={member._id}
              className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col'
            >
              <div className='flex justify-between items-start'>
                <Image
                  src={member.avatar || `https://i.pravatar.cc/150?u=${member._id}`}
                  alt={`${member.firstName} ${member.lastName}`}
                  width={64}
                  height={64}
                  className='w-16 h-16 rounded-full'
                />
                <div className='flex flex-col items-end gap-1'>
                  <span className='px-2 py-1 text-xs font-semibold rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'>
                    {member.role}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                      member.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : member.status === 'terminated'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}
                  >
                    {member.status}
                  </span>
                </div>
              </div>
              <div className='mt-4'>
                <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
                  {member.firstName} {member.lastName}
                </h3>
                <p className='text-sm text-gray-500 dark:text-gray-400'>{member.position}</p>
                <div className='text-sm text-gray-500 dark:text-gray-400 mt-2 space-y-1'>
                  <p className='flex items-center'>
                    <MailIcon className='w-4 h-4 mr-2' /> {member.email}
                  </p>
                  <p className='flex items-center'>
                    <PhoneIcon className='w-4 h-4 mr-2' /> {member.phone}
                  </p>
                  <p className='flex items-center'>
                    <CurrencyDollarIcon className='w-4 h-4 mr-2' /> $
                    {member.salary?.toLocaleString() || 0}
                    /year
                  </p>
                </div>
              </div>
              <div className='mt-auto pt-4 border-t dark:border-gray-700 flex justify-end space-x-2'>
                <button
                  onClick={() => handleOpenModal(member)}
                  className='p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700'
                  title='Edit'
                  disabled={isUpdating}
                >
                  <PencilIcon className='w-5 h-5 text-gray-500' />
                </button>
                <button
                  onClick={() => openDeleteModal(member)}
                  className='p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700'
                  title='Delete'
                  disabled={isDeleting}
                >
                  <TrashIcon className='w-5 h-5 text-red-500' />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {staffData?.payload?.total && staffData.payload.total > limit && (
        <div className='flex justify-between items-center mt-4 pt-4 border-t dark:border-gray-700'>
          <p className='text-sm text-gray-500'>
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, staffData.payload.total)} of{' '}
            {staffData.payload.total} staff members
          </p>
          <div className='flex gap-2'>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className='px-3 py-1 rounded border dark:border-gray-600 disabled:opacity-50'
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page * limit >= staffData.payload.total}
              className='px-3 py-1 rounded border dark:border-gray-600 disabled:opacity-50'
            >
              Next
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <StaffModal
          staffMember={editingStaff}
          onSave={handleSave}
          onClose={handleCloseModal}
          isLoading={isCreating || isUpdating}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          onConfirm={handleDelete}
          onCancel={() => setDeleteModalOpen(false)}
          isLoading={isDeleting}
        />
      )}
    </div>
  )
}

const StaffModal: React.FC<{
  staffMember: StaffType | null
  onSave: (staffData: StaffFormData) => void
  onClose: () => void
  isLoading?: boolean
}> = ({ staffMember, onSave, onClose, isLoading }) => {
  const isEditing = !!staffMember

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateStaffFormData | UpdateStaffFormData>({
    resolver: zodResolver(isEditing ? updateStaffSchema : createStaffSchema),
    defaultValues: {
      firstName: staffMember?.firstName || '',
      lastName: staffMember?.lastName || '',
      email: staffMember?.email || '',
      phone: staffMember?.phone || '',
      role: staffMember?.role || 'Staff',
      position: staffMember?.position || '',
      department: staffMember?.department || '',
      salary: staffMember?.salary || 50000,
      employmentType: staffMember?.employmentType || 'full-time',
      hireDate: staffMember?.hireDate
        ? new Date(staffMember.hireDate).toISOString().split('T')[0]
        : '',
      address: staffMember?.address || '',
      password: '',
    },
  })

  const onSubmit = (data: CreateStaffFormData | UpdateStaffFormData) => {
    onSave(data as StaffFormData)
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-bold'>{staffMember ? 'Edit' : 'Add New'} Staff Member</h2>
          <button onClick={onClose}>
            <XIcon className='w-6 h-6' />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <input
                type='text'
                {...register('firstName')}
                placeholder='First Name'
                className='p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600'
              />
              {errors.firstName && <InputErrorWrapper message={errors.firstName.message || ''} />}
            </div>
            <div>
              <input
                type='text'
                {...register('lastName')}
                placeholder='Last Name'
                className='p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600'
              />
              {errors.lastName && <InputErrorWrapper message={errors.lastName.message || ''} />}
            </div>
            <div>
              <input
                type='email'
                {...register('email')}
                placeholder='Email'
                disabled={isEditing}
                className='p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50'
              />
              {errors.email && <InputErrorWrapper message={errors.email.message || ''} />}
            </div>
            <div>
              <input
                type='tel'
                {...register('phone')}
                placeholder='Phone'
                className='p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600'
              />
              {errors.phone && <InputErrorWrapper message={errors.phone.message || ''} />}
            </div>
            <div>
              <select
                {...register('role')}
                className='p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600'
              >
                {ROLES.map(role => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              {errors.role && <InputErrorWrapper message={errors.role.message || ''} />}
            </div>
            <div>
              <input
                type='text'
                {...register('position')}
                placeholder='Position/Job Title'
                className='p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600'
              />
              {errors.position && <InputErrorWrapper message={errors.position.message || ''} />}
            </div>
            <div>
              <input
                type='text'
                {...register('department')}
                placeholder='Department'
                className='p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600'
              />
              {errors.department && <InputErrorWrapper message={errors.department.message || ''} />}
            </div>
            <div>
              <select
                {...register('employmentType')}
                className='p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600'
              >
                <option value='full-time'>Full Time</option>
                <option value='part-time'>Part Time</option>
                <option value='contract'>Contract</option>
                <option value='intern'>Intern</option>
              </select>
              {errors.employmentType && (
                <InputErrorWrapper message={errors.employmentType.message || ''} />
              )}
            </div>
            <div>
              <input
                type='number'
                {...register('salary', { valueAsNumber: true })}
                placeholder='Salary'
                className='p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600'
              />
              {errors.salary && <InputErrorWrapper message={errors.salary.message || ''} />}
            </div>
            <div>
              <input
                type='date'
                {...register('hireDate')}
                className='p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600'
              />
              {errors.hireDate && <InputErrorWrapper message={errors.hireDate.message || ''} />}
            </div>
          </div>
          {!isEditing && (
            <div>
              <input
                type='password'
                {...register('password')}
                placeholder='Password (min 8 characters)'
                className='p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600'
              />
              {errors.password && <InputErrorWrapper message={errors.password.message || ''} />}
            </div>
          )}
          <div>
            <input
              type='text'
              {...register('address')}
              placeholder='Address'
              className='p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600'
            />
            {errors.address && <InputErrorWrapper message={errors.address.message || ''} />}
          </div>
          <div className='flex justify-end pt-4'>
            <button
              type='button'
              onClick={onClose}
              className='mr-2 px-4 py-2 rounded bg-gray-200 dark:bg-gray-600'
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 rounded bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50'
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const DeleteConfirmationModal: React.FC<{
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}> = ({ onConfirm, onCancel, isLoading }) => (
  <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm'>
      <h3 className='text-lg font-bold mb-2'>Confirm Deletion</h3>
      <p className='text-gray-600 dark:text-gray-400 mb-4'>
        Are you sure? This action cannot be undone.
      </p>
      <div className='flex justify-end'>
        <button
          onClick={onCancel}
          className='mr-2 px-4 py-2 rounded bg-gray-200 dark:bg-gray-600'
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className='px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50'
          disabled={isLoading}
        >
          {isLoading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  </div>
)

export default Staff
