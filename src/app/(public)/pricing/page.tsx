"use client"
import React from 'react';
import { CheckIcon } from '../../../components/Icons';

type PublicPage = 'home' | 'features' | 'pricing' | 'about' | 'contact' | 'login' | 'signup';

interface PricingPageProps {
    onNavigate: (page: PublicPage) => void;
}

const freeFeatures = [
    'Up to 5 Quotations/month',
    'Up to 5 Invoices/month',
    'Manage up to 25 Inventory Items',
    'Up to 3 Staff/User Accounts',
    'Basic Analytics Dashboard',
];

const proFeatures = [
    'Everything in Free, plus:',
    'Unlimited Quotations & Invoices',
    'Unlimited Inventory Items',
    'Unlimited Staff & User Roles',
    'Advanced Analytics & Reporting',
    'Payroll Management',
    'Expense Tracking',
    'Tax Filing Support',
    'Priority Email & Chat Support',
];


const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
    return (
        <div className="bg-gray-100 dark:bg-gray-900 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-base font-semibold leading-7 text-teal-600 dark:text-teal-400">Pricing</h2>
                    <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                        The right price for you, whoever you are
                    </p>
                </div>
                <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600 dark:text-gray-300">
                    Start for free and get a feel for our platform. Our paid plan with advanced features is on the way!
                </p>

                <div className="isolate mx-auto mt-16 grid max-w-lg grid-cols-1 items-stretch gap-8 md:max-w-none md:grid-cols-2">
                    {/* Free Plan */}
                    <div className="flex flex-col justify-between rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-xl ring-1 ring-gray-900/10 sm:p-10">
                        <div>
                            <h3 className="text-base font-semibold leading-7 text-teal-600 dark:text-teal-400">Free</h3>
                            <div className="mt-4 flex items-baseline gap-x-2">
                                <span className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white">$0</span>
                                <span className="text-base font-semibold leading-7 text-gray-600 dark:text-gray-400">/month</span>
                            </div>
                            <p className="mt-6 text-base leading-7 text-gray-600 dark:text-gray-300">
                                Perfect for new businesses and freelancers getting started.
                            </p>
                            <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                                {freeFeatures.map((feature) => (
                                    <li key={feature} className="flex gap-x-3">
                                        <CheckIcon className="h-6 w-5 flex-none text-teal-600 dark:text-teal-400" aria-hidden="true" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <button
                            onClick={() => onNavigate('signup')}
                            className="mt-8 block rounded-md bg-teal-600 px-3.5 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-teal-500  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                        >
                            Get started
                        </button>
                    </div>

                    {/* Pro Plan */}
                    <div className="relative flex flex-col justify-between rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-xl ring-2 ring-teal-600 sm:p-10">
                        <div className="absolute top-0 -translate-y-1/2 transform rounded-full bg-teal-600 px-4 py-1.5 text-sm font-semibold text-white">
                            Coming Soon
                        </div>
                        <div>
                            <h3 className="text-base font-semibold leading-7 text-teal-600 dark:text-teal-400">Pro</h3>
                            <div className="mt-4 flex items-baseline gap-x-2">
                                <span className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white">$XX</span>
                                <span className="text-base font-semibold leading-7 text-gray-600 dark:text-gray-400">/month</span>
                            </div>
                            <p className="mt-6 text-base leading-7 text-gray-600 dark:text-gray-300">
                                The ultimate toolkit for established businesses looking to scale.
                            </p>
                            <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                                {proFeatures.map((feature) => (
                                    <li key={feature} className="flex gap-x-3">
                                        <CheckIcon className="h-6 w-5 flex-none text-teal-600 dark:text-teal-400" aria-hidden="true" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <button
                            disabled
                            className="mt-8 block rounded-md bg-gray-400 dark:bg-gray-600 px-3.5 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm cursor-not-allowed"
                        >
                            Notify Me
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PricingPage;