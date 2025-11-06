"use client";
import React from 'react';
import { MenuIcon } from './Icons';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { toggleSidebar } from '../store/slices/uiSlice';
import { logout as authLogout } from '../store/slices/authSlice';
import Image from 'next/image';

interface HeaderProps {
    toggleMobileSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleMobileSidebar }) => {
    const companyDetails = useAppSelector((state) => state.company.details);

    // Mock logged-in user details
    const loggedInUser = {
        name: 'Christiana Hart',
        avatarUrl: 'https://i.pravatar.cc/150?u=staff-1', // Using the same avatar as in Staff mock data
    };

    return (
        <header className="bg-white dark:bg-gray-800 shadow-md z-20 shrink-0">
            <div className="flex items-center p-4 h-16">
                {/* Mobile menu button */}
                <button
                    onClick={toggleMobileSidebar}
                    className="text-gray-500 dark:text-gray-400 focus:outline-none md:hidden"
                    aria-label="Open sidebar"
                >
                    <MenuIcon className="h-6 w-6" />
                </button>

                {/* Company and User Details - pushed to the right with ml-auto */}
                <div className="flex items-center space-x-4 ml-auto">


                    <div className="h-8 w-px bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>

                    <div className="flex items-center space-x-2">
                        <Image
                            src={loggedInUser.avatarUrl}
                            alt={loggedInUser.name}
                            className="h-8 w-8 rounded-full"
                            width={32}
                            height={32}
                        />
                        <div className="flex flex-col">
                            <span className="hidden sm:inline font-semibold text-gray-900 dark:text-white">{companyDetails.name}</span>

                            <span className="hidden sm:inline font-semibold text-gray-900 dark:text-white">{loggedInUser.name}</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;