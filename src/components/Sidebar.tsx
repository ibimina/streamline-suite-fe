import React, { useContext } from 'react';
import {
    HomeIcon, ClipboardListIcon, DocumentTextIcon, CollectionIcon, ReceiptRefundIcon, ChartPieIcon, BriefcaseIcon, CashIcon, ReceiptTaxIcon, ShieldCheckIcon, CogIcon, SunIcon, MoonIcon, LogoutIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon
} from './Icons';
import Logo from './Logo';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import Link from 'next/link';
import { setCurrentPage, setDesktopSidebarCollapsed, setMobileSidebarOpen, setTheme } from '@/store/slices/uiSlice';

export type View = 'Dashboard' | 'Quotations' | 'Invoices' | 'Inventory' | 'Expenses' | 'Analytics' | 'Staff' | 'Payroll' | 'Taxes' | 'Admin' | 'Settings';



const navigationItems: { name: View; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
    { name: 'Dashboard', icon: HomeIcon },
    { name: 'Quotations', icon: ClipboardListIcon },
    { name: 'Invoices', icon: DocumentTextIcon },
    { name: 'Inventory', icon: CollectionIcon },
    { name: 'Expenses', icon: ReceiptRefundIcon },
    { name: 'Analytics', icon: ChartPieIcon },
    { name: 'Staff', icon: BriefcaseIcon },
    { name: 'Payroll', icon: CashIcon },
    { name: 'Taxes', icon: ReceiptTaxIcon },
];

const secondaryNavigationItems: { name: View; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
    { name: 'Admin', icon: ShieldCheckIcon },
    { name: 'Settings', icon: CogIcon },
];

const Sidebar = () => {
    const dispatch = useAppDispatch();
    const { theme, currentPage, isMobileSidebarOpen, isDesktopSidebarCollapsed } = useAppSelector(state => state.ui);
    const onLogout = () => {
        // Dispatch logout actionisMobileSidebarOpen
        dispatch(logout());
    }

    const NavLink: React.FC<{ item: { name: View; icon: React.FC<React.SVGProps<SVGSVGElement>> } }> = ({ item }) => {
        const isActive = currentPage?.toLowerCase() === item?.name?.toLowerCase();
        return (
            <Link
                href={`/${item?.name?.toLowerCase()}`}
                onClick={() => {
                    dispatch(setCurrentPage(item?.name));
                    if (isMobileSidebarOpen) {
                        dispatch(setMobileSidebarOpen(false));
                    }
                }}
                className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 group ${isActive
                    ? 'bg-teal-500 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    } ${isDesktopSidebarCollapsed ? 'justify-center' : ''}`}
                title={isDesktopSidebarCollapsed ? item.name : undefined}
            >
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-gray-400 dark:text-gray-400'} ${!isDesktopSidebarCollapsed ? 'mr-3' : ''}`} />
                {!isDesktopSidebarCollapsed && <span>{item.name}</span>}
            </Link>
        );
    };

    const sidebarContent = (
        <div className="flex flex-col h-full bg-white dark:bg-gray-800 shadow-xl">
            <div className={`flex items-center h-16 border-b dark:border-gray-700 shrink-0 px-4 bg-white dark:bg-gray-800 ${isDesktopSidebarCollapsed ? 'justify-center' : 'justify-start'}`}>
                <Logo className={`${isDesktopSidebarCollapsed ? 'h-6 w-6 text-teal-400' : 'h-6 w-6'} shrink-0`} />
                {!isDesktopSidebarCollapsed && <h1 className="ml-3 flex-1 min-w-0 text-xl font-bold text-gray-900 dark:text-white truncate">Streamline Suite</h1>}
            </div>
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
                <nav className="space-y-2">
                    {navigationItems.map(item => <NavLink key={item.name} item={item} />)}
                </nav>
                <hr className="my-4 border-gray-200 dark:border-gray-700" />
                <nav className="space-y-2">
                    {secondaryNavigationItems.map(item => <NavLink key={item.name} item={item} />)}
                </nav>
            </div>
            <div className="p-4 border-t dark:border-gray-700 shrink-0">
                <div className={`flex items-center ${isDesktopSidebarCollapsed ? 'flex-col space-y-2' : 'justify-between'}`}>
                    <button
                        onClick={() => {
                            dispatch(setTheme(theme === 'light' ? 'dark' : 'light'));
                        }}
                        className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                        title="Toggle theme"
                    >
                        {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
                    </button>
                    <button
                        onClick={onLogout}
                        className={`flex items-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 ${isDesktopSidebarCollapsed ? 'w-full justify-center' : ''}`}
                        title={isDesktopSidebarCollapsed ? 'Logout' : undefined}
                    >
                        <LogoutIcon className={`w-5 h-5 text-gray-400 ${!isDesktopSidebarCollapsed ? 'mr-2' : ''}`} />
                        {!isDesktopSidebarCollapsed && 'Logout'}
                    </button>
                </div>
                {/* Desktop-only collapse button */}
                <div className="hidden md:block mt-4">
                    <button
                        onClick={() => dispatch(setDesktopSidebarCollapsed(!isDesktopSidebarCollapsed))}
                        className="w-full flex items-center justify-center p-2 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                        {isDesktopSidebarCollapsed ? <ChevronDoubleRightIcon className="w-5 h-5" /> : <ChevronDoubleLeftIcon className="w-5 h-5" />}
                        {!isDesktopSidebarCollapsed && <span className="ml-2">Collapse</span>}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Sidebar */}
            <div className={`fixed inset-0 z-30 md:hidden transition-opacity ${isMobileSidebarOpen ? 'block' : 'hidden'}`}>
                {/* Overlay */}
                <div className="absolute inset-0 bg-black opacity-50" onClick={() => dispatch(setMobileSidebarOpen(false))}></div>
                {/* Sidebar */}
                <div className={`relative w-72  h-full transition-transform duration-300 ease-in-out bg-white dark:bg-gray-800 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    {sidebarContent}
                </div>
            </div>

            {/* Desktop Sidebar */}
            <aside className={`hidden md:flex md:flex-col md:shrink-0 transition-all duration-300 ease-in-out border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 ${isDesktopSidebarCollapsed ? 'w-20' : 'w-72'}`}>
                {sidebarContent}
            </aside>
        </>
    );
};

export default Sidebar;