"use client"
import React from 'react';
import { PhoneIcon, MailIcon } from '../../../components/Icons';
import Image from 'next/image';

const ContactPage: React.FC = () => {

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Thank you for your message! We'll get back to you shortly.");
        // Here you would typically handle form submission, e.g., send data to an API
        (e.target as HTMLFormElement).reset();
    };

    return (
        <div className="relative isolate bg-white dark:bg-gray-800">
            <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
                <div className="relative px-6 pb-20 pt-24 sm:pt-32 lg:static lg:px-8 lg:py-48 bg-gray-900">
                    <Image
                        className="absolute inset-0 h-full w-full object-cover object-center"
                        src="https://images.unsplash.com/photo-1573497491208-6b1acb260507?q=80&w=2070&auto=format&fit=crop"
                        alt="A professional woman in an office"
                        layout="fill"
                    />
                    <div className="absolute inset-0 bg-gray-900/60"></div>
                    <div className="relative mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
                        <h2 className="text-3xl font-bold tracking-tight text-white">Get in touch</h2>
                        <p className="mt-6 text-lg leading-8 text-gray-200">
                            Have questions about our features, pricing, or how Streamline Suite can help your business? We&apos;d love to hear from you.
                        </p>
                        <dl className="mt-10 space-y-4 text-base leading-7 text-gray-200">
                            <div className="flex gap-x-4">
                                <dt className="flex-none">
                                    <span className="sr-only">Address</span>
                                    <span role="img" aria-label="office building">🏢</span>
                                </dt>
                                <dd>123 Software Lane<br />Innovation City, 12345</dd>
                            </div>
                            <div className="flex gap-x-4">
                                <dt className="flex-none">
                                    <span className="sr-only">Telephone</span>
                                    <PhoneIcon className="w-5 h-5 text-gray-300" />
                                </dt>
                                <dd><a className="hover:text-white" href="tel:+1 (555) 234-5678">+1 (555) 234-5678</a></dd>
                            </div>
                            <div className="flex gap-x-4">
                                <dt className="flex-none">
                                    <span className="sr-only">Email</span>
                                    <MailIcon className="w-5 h-5 text-gray-300" />
                                </dt>
                                <dd><a className="hover:text-white" href="mailto:hello@streamlinesuite.com">hello@streamlinesuite.com</a></dd>
                            </div>
                        </dl>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="px-6 pb-24 pt-20 sm:pb-32 lg:px-8 lg:py-48">
                    <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
                        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                            <div>
                                <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white">First name</label>
                                <div className="mt-2.5">
                                    <input type="text" name="first-name" id="first-name" autoComplete="given-name" required className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 bg-white dark:bg-gray-700" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="last-name" className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white">Last name</label>
                                <div className="mt-2.5">
                                    <input type="text" name="last-name" id="last-name" autoComplete="family-name" required className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 bg-white dark:bg-gray-700" />
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white">Email</label>
                                <div className="mt-2.5">
                                    <input type="email" name="email" id="email" autoComplete="email" required className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 bg-white dark:bg-gray-700" />
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white">Message</label>
                                <div className="mt-2.5">
                                    <textarea name="message" id="message" rows={4} required className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 bg-white dark:bg-gray-700"></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <button type="submit" className="rounded-md bg-teal-500 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-teal-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">Send message</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContactPage;