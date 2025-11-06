"use client"
import React, { useState } from 'react';
import { User, Role, ROLES } from '../types';
import { DotsVerticalIcon, PencilIcon, TrashIcon, XIcon, MailIcon } from './Icons';

// Mock Data
const mockUsers: User[] = [
    { id: 'user-1', name: 'Admin User', email: 'admin@example.com', role: 'Admin', lastLogin: '2024-07-29T10:00:00Z' },
    { id: 'user-2', name: 'Christiana Hart', email: 'c.hart@example.com', role: 'Manager', lastLogin: '2024-07-29T09:30:00Z' },
    { id: 'user-3', name: 'John Doe', email: 'j.doe@example.com', role: 'Sales Rep', lastLogin: '2024-07-28T15:45:00Z' },
];

const Admin: React.FC = () => {
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);

    const handleOpenModal = (user: User | null = null) => {
        setEditingUser(user);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingUser(null);
        setModalOpen(false);
    };

    const handleSave = (user: User & { password?: string }) => {
        // In a real app, you would never store the plain password.
        // This is for demonstration purposes only.
        const { password, ...userData } = user;
        
        if (editingUser) {
            setUsers(users.map(u => u.id === userData.id ? userData : u));
        } else {
            setUsers([{ ...userData, id: `user-${Date.now()}`, lastLogin: new Date().toISOString() }, ...users]);
        }
        handleCloseModal();
    };
    
    const openDeleteModal = (user: User) => {
        setDeletingUser(user);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (deletingUser) {
            setUsers(users.filter(u => u.id !== deletingUser.id));
            setDeleteModalOpen(false);
            setDeletingUser(null);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Panel: User Management</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Add, edit, and manage user roles and permissions.</p>
            </div>
             <div className="flex justify-end">
                <button onClick={() => handleOpenModal()} className="bg-teal-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors">
                    Add New User
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg overflow-x-auto">
                 <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-3">User</th>
                            <th className="px-6 py-3">Role</th>
                            <th className="px-6 py-3">Last Login</th>
                            <th className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200">{user.role}</span>
                                </td>
                                <td className="px-6 py-4">
                                    {new Date(user.lastLogin).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button onClick={() => handleOpenModal(user)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" title="Edit User">
                                        <PencilIcon className="w-5 h-5 text-gray-500"/>
                                    </button>
                                     <button onClick={() => openDeleteModal(user)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" title="Delete User">
                                        <TrashIcon className="w-5 h-5 text-red-500"/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                 </table>
            </div>
            {isModalOpen && <UserModal user={editingUser} onSave={handleSave} onClose={handleCloseModal} />}
            {isDeleteModalOpen && <DeleteConfirmationModal onConfirm={confirmDelete} onCancel={() => setDeleteModalOpen(false)} />}
        </div>
    );
};

const UserModal: React.FC<{
    user: User | null;
    onSave: (user: User & { password?: string }) => void;
    onClose: () => void;
}> = ({ user, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        role: user?.role || 'Technician',
        password: ''
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const userToSave = {
            ...(user || {id: '', lastLogin: ''}),
            ...formData
        };
        onSave(userToSave);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg">
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{user ? 'Edit' : 'Add New'} User</h2>
                    <button onClick={onClose}><XIcon className="w-6 h-6"/></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                            <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="mt-1 p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                            <select name="role" value={formData.role} onChange={handleChange} className="mt-1 p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600">
                               {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="mt-1 p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                        <input type="password" name="password" placeholder={user ? "Leave blank to keep unchanged" : "Password"} value={formData.password} onChange={handleChange} required={!user} className="mt-1 p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600"/>
                    </div>
                     <div className="flex justify-end pt-4">
                        <button type="button" onClick={onClose} className="mr-2 px-4 py-2 rounded bg-gray-200 dark:bg-gray-600">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded bg-teal-500 text-white hover:bg-teal-600">Save User</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

const DeleteConfirmationModal: React.FC<{onConfirm: () => void, onCancel: () => void}> = ({ onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm">
                <h3 className="text-lg font-bold mb-2">Confirm Deletion</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Are you sure you want to delete this user? This action cannot be undone.</p>
                <div className="flex justify-end">
                    <button onClick={onCancel} className="mr-2 px-4 py-2 rounded bg-gray-200 dark:bg-gray-600">Cancel</button>
                    <button onClick={onConfirm} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">Delete</button>
                </div>
            </div>
        </div>
    );
};

export default Admin;