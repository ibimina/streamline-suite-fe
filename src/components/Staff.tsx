'use client'
import React, { useState } from 'react'
import { StaffMember, ROLES } from '../types'
import { PencilIcon, TrashIcon, XIcon, MailIcon, PhoneIcon, CurrencyDollarIcon } from './Icons'
import Image from 'next/image'

// Mock Data
const mockStaff: StaffMember[] = [
  {
    id: 'staff-1',
    name: 'Christiana Hart',
    role: 'Admin',
    email: 'c.hart@example.com',
    phone: '(555) 123-4567',
    salary: 95000,
    hireDate: '2022-01-15',
    avatarUrl: `https://i.pravatar.cc/150?u=staff-1`,
  },
  {
    id: 'staff-2',
    name: 'John Doe',
    role: 'Sales Rep',
    email: 'j.doe@example.com',
    phone: '(555) 987-6543',
    salary: 72000,
    hireDate: '2022-08-01',
    avatarUrl: `https://i.pravatar.cc/150?u=staff-2`,
  },
  {
    id: 'staff-3',
    name: 'Jane Smith',
    role: 'Accountant',
    email: 'j.smith@example.com',
    phone: '(555) 555-1212',
    salary: 80000,
    hireDate: '2021-11-20',
    avatarUrl: `https://i.pravatar.cc/150?u=staff-3`,
  },
]

const Staff: React.FC = () => {
  const [staff, setStaff] = useState<StaffMember[]>(mockStaff)
  const [isModalOpen, setModalOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null)

  const handleOpenModal = (staffMember: StaffMember | null = null) => {
    setEditingStaff(staffMember)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setEditingStaff(null)
    setModalOpen(false)
  }

  const handleSave = (staffMember: StaffMember) => {
    if (editingStaff) {
      setStaff(staff.map(s => (s.id === staffMember.id ? staffMember : s)))
    } else {
      setStaff([
        {
          ...staffMember,
          id: `staff-${Date.now()}`,
          avatarUrl: `https://i.pravatar.cc/150?u=${Date.now()}`,
        },
        ...staff,
      ])
    }
    handleCloseModal()
  }

  const handleDelete = (staffId: string) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      setStaff(staff.filter(s => s.id !== staffId))
    }
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
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {staff.map(member => (
          <div
            key={member.id}
            className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col'
          >
            <div className='flex justify-between items-start'>
              <Image src={member.avatarUrl} alt={member.name} className='w-16 h-16 rounded-full' />
              <span className='px-2 py-1 text-xs font-semibold rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'>
                {member.role}
              </span>
            </div>
            <div className='mt-4'>
              <h3 className='text-lg font-bold text-gray-900 dark:text-white'>{member.name}</h3>
              <div className='text-sm text-gray-500 dark:text-gray-400 mt-2 space-y-1'>
                <p className='flex items-center'>
                  <MailIcon className='w-4 h-4 mr-2' /> {member.email}
                </p>
                <p className='flex items-center'>
                  <PhoneIcon className='w-4 h-4 mr-2' /> {member.phone}
                </p>
                <p className='flex items-center'>
                  <CurrencyDollarIcon className='w-4 h-4 mr-2' /> ${member.salary.toLocaleString()}
                  /year
                </p>
              </div>
            </div>
            <div className='mt-auto pt-4 border-t dark:border-gray-700 flex justify-end space-x-2'>
              <button
                onClick={() => handleOpenModal(member)}
                className='p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700'
                title='Edit'
              >
                <PencilIcon className='w-5 h-5 text-gray-500' />
              </button>
              <button
                onClick={() => handleDelete(member.id)}
                className='p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700'
                title='Delete'
              >
                <TrashIcon className='w-5 h-5 text-red-500' />
              </button>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <StaffModal staffMember={editingStaff} onSave={handleSave} onClose={handleCloseModal} />
      )}
    </div>
  )
}

const StaffModal: React.FC<{
  staffMember: StaffMember | null
  onSave: (staffMember: StaffMember) => void
  onClose: () => void
}> = ({ staffMember, onSave, onClose }) => {
  const [formData, setFormData] = useState<Omit<StaffMember, 'id' | 'avatarUrl'>>(
    staffMember || {
      name: '',
      role: 'Technician',
      email: '',
      phone: '',
      salary: 50000,
      hireDate: '',
    }
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: name === 'salary' ? Number(value) : value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ ...(staffMember || { id: '', avatarUrl: '' }), ...formData })
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-bold'>{staffMember ? 'Edit' : 'Add New'} Staff Member</h2>
          <button onClick={onClose}>
            <XIcon className='w-6 h-6' />
          </button>
        </div>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <input
              type='text'
              name='name'
              placeholder='Full Name'
              value={formData.name}
              onChange={handleChange}
              required
              className='p-2 border rounded dark:bg-gray-700 dark:border-gray-600'
            />
            <select
              name='role'
              value={formData.role}
              onChange={handleChange}
              className='p-2 border rounded dark:bg-gray-700 dark:border-gray-600'
            >
              {ROLES.map(role => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <input
              type='email'
              name='email'
              placeholder='Email'
              value={formData.email}
              onChange={handleChange}
              required
              className='p-2 border rounded dark:bg-gray-700 dark:border-gray-600'
            />
            <input
              type='tel'
              name='phone'
              placeholder='Phone'
              value={formData.phone}
              onChange={handleChange}
              className='p-2 border rounded dark:bg-gray-700 dark:border-gray-600'
            />
            <input
              type='number'
              name='salary'
              placeholder='Salary'
              value={formData.salary}
              onChange={handleChange}
              required
              className='p-2 border rounded dark:bg-gray-700 dark:border-gray-600'
            />
            <input
              type='date'
              name='hireDate'
              value={formData.hireDate}
              onChange={handleChange}
              required
              className='p-2 border rounded dark:bg-gray-700 dark:border-gray-600'
            />
          </div>
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
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Staff
