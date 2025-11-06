"use client"
import React, { useState } from 'react';
import { PayrollRun } from '../types';
import { DownloadIcon } from './Icons';

const mockPayrollRuns: PayrollRun[] = [
    { id: 'pr-1', payPeriodStart: '2024-07-01', payPeriodEnd: '2024-07-15', totalAmount: 18750, status: 'Completed' },
    { id: 'pr-2', payPeriodStart: '2024-06-16', payPeriodEnd: '2024-06-30', totalAmount: 18750, status: 'Completed' },
    { id: 'pr-3', payPeriodStart: '2024-06-01', payPeriodEnd: '2024-06-15', totalAmount: 18500, status: 'Completed' },
];

const StatusBadge: React.FC<{ status: 'Completed' | 'Pending' }> = ({ status }) => {
    const baseClasses = 'px-2 py-1 text-xs font-semibold rounded-full inline-block';
    const statusClasses = {
        Completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const Payroll: React.FC = () => {
    const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>(mockPayrollRuns);
    
    const handleRunPayroll = () => {
        // This would normally trigger a complex calculation process.
        // For this mock, we'll just show an alert.
        alert("A new payroll run would be calculated and added here.");
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Salary Payments (Payroll)</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and track all payroll history.</p>
            </div>
            <div className="flex justify-between items-center">
                <div/>
                <button onClick={handleRunPayroll} className="bg-teal-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors">
                    Run New Payroll
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg overflow-x-auto">
                 <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-3">Pay Period</th>
                            <th className="px-6 py-3">Total Payroll</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payrollRuns.map(run => (
                            <tr key={run.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium">{`${run.payPeriodStart} to ${run.payPeriodEnd}`}</td>
                                <td className="px-6 py-4 font-semibold">${run.totalAmount.toLocaleString()}</td>
                                <td className="px-6 py-4"><StatusBadge status={run.status} /></td>
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

export default Payroll;
