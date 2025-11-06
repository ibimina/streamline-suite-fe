"use client"
import React from 'react';
import Image from 'next/image';

const teamMembers = [
    {
        name: 'Alex Johnson',
        role: 'Founder & CEO',
        imageUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070&auto=format&fit=crop',
        bio: 'With over 15 years of experience helping small businesses grow, Alex saw the need for a tool that simplifies complex operations and helps owners get back to doing what they love.'
    },
    {
        name: 'Maria Garcia',
        role: 'Lead Developer',
        imageUrl: 'https://images.unsplash.com/photo-1557053910-d9eadeed1c58?q=80&w=1974&auto=format&fit=crop',
        bio: 'Maria is the architectural mastermind behind Streamline Suite, dedicated to building a robust, scalable, and user-friendly platform.'
    },
    {
        name: 'Sam Chen',
        role: 'UX/UI Designer',
        imageUrl: 'https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=1974&auto=format&fit=crop',
        bio: 'Sam ensures that every click within Streamline Suite is intuitive and efficient, focusing on creating a seamless user experience.'
    },
]

const AboutUsPage: React.FC = () => {
    return (
        <div className="bg-white dark:bg-gray-800">
            {/* Hero Section */}
            <div className="relative h-96">
                <Image
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
                    alt="Team working together"
                    layout="fill"
                />
                <div className="absolute inset-0 bg-gray-900 bg-opacity-60" />
                <div className="relative h-full flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                            We&apos;re changing how business gets done.
                        </h1>
                        <p className="mt-6 text-lg max-w-2xl mx-auto leading-8 text-gray-200">
                            We are a team of developers, designers, and industry veterans passionate about creating software that solves real-world problems.
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="mx-auto max-w-7xl py-24 sm:py-32 px-6 lg:px-8">
                <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                    <div className="lg:pr-8 lg:pt-4">
                        <div className="lg:max-w-lg">
                            <h3 className="text-base font-semibold leading-7 text-teal-600 dark:text-teal-400">Our Mission</h3>
                            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">To Empower Your Business</p>
                            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                                Our mission is to empower small and medium-sized businesses with powerful, intuitive software. We aim to help you streamline your operations, eliminate administrative headaches, and achieve scalable growth by providing a tool that feels like it was custom-built for your needs.
                            </p>
                        </div>
                    </div>
                    <div className="lg:pr-8 lg:pt-4">
                        <div className="lg:max-w-lg">
                            <h3 className="text-base font-semibold leading-7 text-teal-600 dark:text-teal-400">Our Story</h3>
                             <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Born from Experience</p>
                            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                                Streamline Suite was born after years of watching entrepreneurs and small business owners struggle with generic, clunky software that didn&apos;t fit their workflow. We decided to build something better: a single, elegant solution to manage the entire business lifecycle, from the initial quote to the final payment.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mx-auto mt-24 max-w-2xl lg:mx-0 lg:max-w-none">
                     <h3 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl text-center">Meet Our Team</h3>
                     <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto">
                        We’re a small, dedicated team that believes in the power of collaboration and craftsmanship.
                    </p>
                    <ul role="list" className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 sm:gap-y-16 xl:col-span-2">
                        {teamMembers.map((person) => (
                            <li key={person?.name}>
                                <div className="flex items-center gap-x-6">
                                    <Image className="h-16 w-16 rounded-full object-cover object-center" src={person?.imageUrl} alt="" width={4} height={4} />
                                    <div>
                                        <h3 className="text-base font-semibold leading-7 tracking-tight text-gray-900 dark:text-white">{person?.name}</h3>
                                        <p className="text-sm font-semibold leading-6 text-teal-600 dark:text-teal-400">{person?.role}</p>
                                    </div>
                                </div>
                                <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">{person?.bio}</p>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </div>
    );
};

export default AboutUsPage;