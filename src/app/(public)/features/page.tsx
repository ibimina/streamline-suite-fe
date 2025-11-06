import React from 'react';
import { ClipboardListIcon, DocumentTextIcon, CollectionIcon, ReceiptRefundIcon, ChartPieIcon, BriefcaseIcon, CashIcon, ReceiptTaxIcon } from '../../../components/Icons';
import Image from 'next/image';

const Feature: React.FC<{ icon: React.ReactNode, name: string, description: string }> = ({ icon, name, description }) => (
    <div className="flex flex-col items-center p-6 text-center bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-transform transform hover:-translate-y-1">
        <div className="shrink-0">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-teal-500 text-white">
                {icon}
            </div>
        </div>
        <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{name}</h3>
            <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                {description}
            </p>
        </div>
    </div>
);


const FeaturesPage: React.FC = () => {
    const features = [
        {
            name: 'Quotations',
            description: 'Create, customize, and send professional quotations with advanced pricing and multiple templates.',
            icon: <ClipboardListIcon className="h-6 w-6" />,
        },
        {
            name: 'Invoices',
            description: 'Generate invoices from quotations in one click. Track payment statuses from draft to paid.',
            icon: <DocumentTextIcon className="h-6 w-6" />,
        },
        {
            name: 'Inventory Management',
            description: 'Track stock levels, manage SKUs, and view item movement logs. Automatically deduct stock on paid invoices.',
            icon: <CollectionIcon className="h-6 w-6" />,
        },
        {
            name: 'Expense Tracking',
            description: 'Record and categorize all business expenses to get a clear picture of your cash flow.',
            icon: <ReceiptRefundIcon className="h-6 w-6" />,
        },
        {
            name: 'Sales Analytics',
            description: 'Visualize your business performance with insightful charts on revenue, profit, and top-selling items.',
            icon: <ChartPieIcon className="h-6 w-6" />,
        },
        {
            name: 'Staff Management',
            description: 'Keep all employee records, roles, and contact information organized in one central place.',
            icon: <BriefcaseIcon className="h-6 w-6" />,
        },
        {
            name: 'Payroll',
            description: 'Simplify salary payments with payroll run history and reporting capabilities.',
            icon: <CashIcon className="h-6 w-6" />,
        },
        {
            name: 'Tax Filing Support',
            description: 'Generate reports for sales and purchase taxes to make tax filing season a breeze.',
            icon: <ReceiptTaxIcon className="h-6 w-6" />,
        },
    ];

    return (
        <div className="bg-gray-100 dark:bg-gray-900">
            {/* Hero Section */}
            <div className="relative bg-gray-800">
                <div className="absolute inset-0">
                    <Image
                        className="w-full h-full object-cover object-center"
                        src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
                        alt="Professionals collaborating on a project"
                        layout="fill"
                    />
                    <div className="absolute inset-0 bg-gray-700 mix-blend-multiply" aria-hidden="true" />
                </div>
                <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">Powerful Features</h1>
                    <p className="mt-6 text-xl text-indigo-100 max-w-3xl mx-auto">
                        Everything you need to run your business, all in one place.
                    </p>
                </div>
            </div>
            {/* Features Grid */}
            <div className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-base text-teal-600 dark:text-teal-400 font-semibold tracking-wide uppercase">Our Toolkit</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                            A Better Way to Manage Your Work
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
                            Streamline Suite is packed with powerful features to help you save time, reduce errors, and grow your profits.
                        </p>
                    </div>

                    <div className="mt-12">
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {features.map((feature) => (
                                <Feature key={feature.name} {...feature} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeaturesPage;