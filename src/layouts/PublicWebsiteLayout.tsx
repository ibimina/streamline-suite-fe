"use client";
import React, { useState } from 'react';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';

type PublicPage = 'home' | 'features' | 'pricing' | 'about' | 'contact' | 'login' | 'signup';

interface PublicWebsiteProps {
    children?: React.ReactNode;
}

const PublicWebsiteLayout: React.FC<PublicWebsiteProps> = ({ children }) => {
    const [currentPage, setCurrentPage] = useState<PublicPage>('home');


    return (
        <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
            <PublicHeader activePage={currentPage} onNavigate={setCurrentPage} />
            <main className="grow">
                {children}
            </main>
            <PublicFooter onNavigate={setCurrentPage} />
        </div>
    );
};

export default PublicWebsiteLayout;