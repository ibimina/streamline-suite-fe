"use client";
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setMobileSidebarOpen } from '@/store/slices/uiSlice';



interface PublicWebsiteProps {
    children?: React.ReactNode;
}

const DashboardLayout: React.FC<PublicWebsiteProps> = ({ children }) => {

    const { isAuthenticated } = useAppSelector(state => state.auth);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { isMobileSidebarOpen } = useAppSelector(state => state.ui);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    // if (!isAuthenticated) {
    //     return null;
    // }

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
            <Sidebar

            />
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <Header
                    toggleMobileSidebar={() => dispatch(setMobileSidebarOpen(!isMobileSidebarOpen))}
                />
                <main className="flex-1 overflow-y-auto">
                    <div className="container mx-auto px-6 py-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;