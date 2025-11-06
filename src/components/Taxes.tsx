"use client"
import React, { useState } from 'react';
import { TaxReport } from '../types';
import { DownloadIcon } from './Icons';

const mockReports: TaxReport[] = [
    { id: 'tax-1', period: 'Q2 2024', type: 'Sales Tax', amount: 32500, status: 'Filed' },
    { id: 'tax-2', period: 'Q2 2024', type: 'Purchase Tax', amount: 15200, status: 'Filed' },
    { id: 'tax-3', period: 'Q1 2024', type: 'Sales Tax', amount: 28900, status: 'Filed' },
    { id: 'tax-4', period: 'Q1 2024', type: 'Purchase Tax', amount: 13500, status: 'Filed' },
];

const StatCard: React.FC<{ title: string; value: string; }> = ({ title, value }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <p className="text-gray-500 dark:text-gray-400 font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
    </div>
);

const StatusBadge: React.FC<{ status: 'Filed' | 'Due' }> = ({ status }) => {
    const baseClasses = 'px-2 py-1 text-xs font-semibold rounded-full inline-block';
    const statusClasses = {
        Filed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        Due: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const Taxes: React.FC = () => {
    const [reports, setReports] = useState<TaxReport[]>(mockReports);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tax Filing Support</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Generate reports and track tax filings.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard title="Total Sales Tax Collected (Current Qtr)" value="$35,210" />
                <StatCard title="Total Purchase Tax Paid (Current Qtr)" value="$16,840" />
            </div>

            <div className="flex justify-between items-center">
                 <h2 className="text-xl font-semibold">Tax Filing History</h2>
                <button className="bg-teal-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors">
                    Generate New Report
                </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg overflow-x-auto">
                 <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-3">Period</th>
                            <th className="px-6 py-3">Report Type</th>
                            <th className="px-6 py-3">Amount</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map(report => (
                            <tr key={report.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium">{report.period}</td>
                                <td className="px-6 py-4">{report.type}</td>
                                <td className="px-6 py-4 font-semibold">${report.amount.toLocaleString()}</td>
                                <td className="px-6 py-4"><StatusBadge status={report.status} /></td>
                                <td className="px-6 py-4 text-center">
                                    <button className="text-teal-600 dark:text-teal-400 hover:underline" title="Download Report">
                                        <DownloadIcon className="w-5 h-5 inline-block"/>
                                         <span className="ml-1 sr-only">Download</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                 </table>
            </div>
        </div>
    );
};

export default Taxes;
