"use client"
import React, { useState, useRef } from 'react';
import { SaveIcon } from './Icons';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setCompanyDetails } from '../store/slices/companySlice';

const Settings: React.FC = () => {
    const dispatch = useAppDispatch();
    const companyDetails = useAppSelector((state) => state.company.details);
    const [localDetails, setLocalDetails] = useState(companyDetails);
    const [isSaved, setIsSaved] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLocalDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setLocalDetails(prev => ({ ...prev, logoUrl: event.target!.result as string }));
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(setCompanyDetails(localDetails));
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your application and company settings.</p>
            </div>

            <div className="max-w-2xl">
                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">Company Details</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        This information will appear on your quotations and invoices.
                    </p>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Name</label>
                            <input type="text" name="name" id="name" value={localDetails.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-gray-700" />
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                            <input type="text" name="address" id="address" value={localDetails.address} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-gray-700" />
                        </div>
                        <div>
                            <label htmlFor="contact" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Information (Email / Phone)</label>
                            <input type="text" name="contact" id="contact" value={localDetails.contact} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-gray-700" />
                        </div>

                        {/* Logo Upload Section */}
                        <div className="pt-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Logo</label>
                            <div className="mt-2 flex items-center">
                                <span className="inline-block h-12 w-32 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                    {localDetails.logoUrl ? (
                                        <img src={localDetails.logoUrl} alt="Logo Preview" className="h-full w-full object-contain" />
                                    ) : (
                                        <span className="text-xs text-gray-500">No Logo</span>
                                    )}
                                </span>
                                <input type="file" ref={fileInputRef} onChange={handleLogoChange} accept="image/*" className="hidden" />
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="ml-5 bg-white dark:bg-gray-700 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                                    Change Logo
                                </button>
                            </div>
                        </div>

                    </div>
                    <div className="flex justify-end items-center pt-6">
                        {isSaved && <span className="text-sm text-green-600 dark:text-green-400 mr-4">Changes saved successfully!</span>}
                        <button type="submit" className="inline-flex items-center bg-teal-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors">
                            <SaveIcon className="w-5 h-5 mr-2" />
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;