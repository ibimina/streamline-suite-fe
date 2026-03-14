import React, { useState, useMemo } from 'react'
import {
  HomeIcon,
  ClipboardListIcon,
  DocumentTextIcon,
  CollectionIcon,
  ReceiptRefundIcon,
  ChartPieIcon,
  BriefcaseIcon,
  CashIcon,
  ReceiptTaxIcon,
  ShieldCheckIcon,
  CogIcon,
  SunIcon,
  MoonIcon,
  LogoutIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  PlusIcon,
  EyeIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '../Icons'
import Logo from './Logo'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import Link from 'next/link'
import {
  setCurrentPage,
  setDesktopSidebarCollapsed,
  setMobileSidebarOpen,
  setTheme,
} from '@/store/slices/uiSlice'
import { useLogoutMutation } from '@/store/api'
import { useRouter } from 'next/navigation'
import { usePermissions } from '@/hooks/usePermissions'
import { PermissionName } from '@/contants/permissions'

export type View =
  | 'Dashboard'
  | 'Quotations'
  | 'Invoices'
  | 'Inventory'
  | 'Expenses'
  | 'Analytics'
  | 'Staff'
  | 'Payroll'
  | 'Taxes'
  | 'Admin'
  | 'Settings'
  | 'Suppliers'
  | 'Products'
  | 'Customers'

interface NavigationSubItem {
  name: string
  href: string
  icon: React.FC<React.SVGProps<SVGSVGElement>>
  permissions?: PermissionName[] // Required permissions for this sub-item
}

interface NavigationItem {
  name: View
  icon: React.FC<React.SVGProps<SVGSVGElement>>
  href?: string
  subItems?: NavigationSubItem[]
  permissions?: PermissionName[] // Required permissions (user needs ANY of these)
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    icon: HomeIcon,
    href: '/dashboard',
    permissions: [PermissionName.VIEW_DASHBOARD],
  },
  {
    name: 'Quotations',
    icon: ClipboardListIcon,
    permissions: [PermissionName.VIEW_QUOTATIONS, PermissionName.CREATE_QUOTATIONS],
    subItems: [
      {
        name: 'View All',
        href: '/quotations',
        icon: EyeIcon,
        permissions: [PermissionName.VIEW_QUOTATIONS],
      },
      {
        name: 'Create New',
        href: '/quotations/create',
        icon: PlusIcon,
        permissions: [PermissionName.CREATE_QUOTATIONS],
      },
    ],
  },
  {
    name: 'Invoices',
    icon: DocumentTextIcon,
    permissions: [PermissionName.VIEW_INVOICES, PermissionName.CREATE_INVOICES],
    subItems: [
      {
        name: 'View All',
        href: '/invoices',
        icon: EyeIcon,
        permissions: [PermissionName.VIEW_INVOICES],
      },
      {
        name: 'Create New',
        href: '/invoices/create',
        icon: PlusIcon,
        permissions: [PermissionName.CREATE_INVOICES],
      },
    ],
  },
  {
    name: 'Inventory',
    icon: CollectionIcon,
    href: '/inventory',
    permissions: [PermissionName.VIEW_INVENTORY],
  },
  {
    name: 'Suppliers',
    icon: CollectionIcon,
    href: '/suppliers',
    permissions: [PermissionName.VIEW_SUPPLIERS],
  },
  {
    name: 'Products',
    icon: CollectionIcon,
    href: '/products',
    permissions: [PermissionName.VIEW_PRODUCTS],
  },
  {
    name: 'Customers',
    icon: CollectionIcon,
    href: '/customers',
    permissions: [PermissionName.VIEW_CUSTOMERS],
  },
  {
    name: 'Expenses',
    icon: ReceiptRefundIcon,
    href: '/expenses',
    permissions: [PermissionName.VIEW_EXPENSES],
  },
  {
    name: 'Analytics',
    icon: ChartPieIcon,
    href: '/analytics',
    permissions: [PermissionName.VIEW_REPORTS],
  },
  {
    name: 'Staff',
    icon: BriefcaseIcon,
    href: '/staff',
    permissions: [PermissionName.MANAGE_USERS],
  },
  { name: 'Payroll', icon: CashIcon, href: '/payroll', permissions: [PermissionName.VIEW_PAYROLL] },
  { name: 'Taxes', icon: ReceiptTaxIcon, href: '/taxes', permissions: [PermissionName.VIEW_TAXES] },
]

const secondaryNavigationItems: NavigationItem[] = [
  {
    name: 'Admin',
    icon: ShieldCheckIcon,
    href: '/admin',
    permissions: [PermissionName.MANAGE_USERS],
  },
  {
    name: 'Settings',
    icon: CogIcon,
    href: '/settings',
    permissions: [PermissionName.MANAGE_SETTINGS],
  },
]

const Sidebar = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [logout] = useLogoutMutation()
  const { theme, currentPage, isMobileSidebarOpen, isDesktopSidebarCollapsed } = useAppSelector(
    state => state.ui
  )
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const { hasAnyPermission } = usePermissions()

  // Filter navigation items based on user permissions
  const filteredNavigationItems = useMemo(() => {
    return navigationItems
      .filter(item => {
        // If no permissions required, show the item
        if (!item.permissions || item.permissions.length === 0) return true
        // Check if user has any of the required permissions
        return hasAnyPermission(item.permissions)
      })
      .map(item => {
        // Also filter sub-items if they have permissions
        if (item.subItems) {
          const filteredSubItems = item.subItems.filter(subItem => {
            if (!subItem.permissions || subItem.permissions.length === 0) return true
            return hasAnyPermission(subItem.permissions)
          })
          return { ...item, subItems: filteredSubItems }
        }
        return item
      })
  }, [hasAnyPermission])

  const filteredSecondaryItems = useMemo(() => {
    return secondaryNavigationItems.filter(item => {
      if (!item.permissions || item.permissions.length === 0) return true
      return hasAnyPermission(item.permissions)
    })
  }, [hasAnyPermission])

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName) ? prev.filter(name => name !== itemName) : [...prev, itemName]
    )
  }
  const onLogout = async () => {
    await logout()
    router.push('/')
  }

  const NavLink: React.FC<{ item: NavigationItem }> = ({ item }) => {
    const isActive = currentPage?.toLowerCase() === item?.name?.toLowerCase()
    const isExpanded = expandedItems.includes(item.name)
    const hasSubItems = item.subItems && item.subItems.length > 0

    if (hasSubItems) {
      return (
        <div>
          <button
            onClick={() => !isDesktopSidebarCollapsed && toggleExpanded(item.name)}
            className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
              isActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            } ${isDesktopSidebarCollapsed ? 'justify-center' : 'justify-between'}`}
            title={isDesktopSidebarCollapsed ? item.name : undefined}
          >
            <div className='flex items-center'>
              <item.icon
                className={`w-5 h-5 shrink-0 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'} ${!isDesktopSidebarCollapsed ? 'mr-3' : ''}`}
              />
              {!isDesktopSidebarCollapsed && <span>{item.name}</span>}
            </div>
            {!isDesktopSidebarCollapsed && (
              <div className='flex items-center'>
                {isExpanded ? (
                  <ChevronDownIcon className='w-4 h-4' />
                ) : (
                  <ChevronRightIcon className='w-4 h-4' />
                )}
              </div>
            )}
          </button>

          {/* Sub-items */}
          {!isDesktopSidebarCollapsed && isExpanded && (
            <div className='ml-6 mt-1 space-y-1'>
              {item.subItems?.map(subItem => (
                <Link
                  key={subItem.name}
                  href={subItem.href}
                  onClick={() => {
                    dispatch(setCurrentPage(item.name))
                    if (isMobileSidebarOpen) {
                      dispatch(setMobileSidebarOpen(false))
                    }
                  }}
                  className='flex items-center px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors duration-200'
                >
                  <subItem.icon className='w-4 h-4 mr-3 shrink-0' />
                  {subItem.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      )
    }

    return (
      <Link
        href={item.href || `/${item?.name?.toLowerCase()}`}
        onClick={() => {
          dispatch(setCurrentPage(item?.name))
          if (isMobileSidebarOpen) {
            dispatch(setMobileSidebarOpen(false))
          }
        }}
        className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
          isActive
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
        } ${isDesktopSidebarCollapsed ? 'justify-center' : ''}`}
        title={isDesktopSidebarCollapsed ? item.name : undefined}
      >
        <item.icon
          className={`w-5 h-5 shrink-0 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'} ${!isDesktopSidebarCollapsed ? 'mr-3' : ''}`}
        />
        {!isDesktopSidebarCollapsed && <span>{item.name}</span>}
      </Link>
    )
  }

  const sidebarContent = (
    <div className='flex flex-col h-full bg-card shadow-lg'>
      <div
        className={`flex items-center h-16 border-b border-border shrink-0 px-4 bg-card ${isDesktopSidebarCollapsed ? 'justify-center' : 'justify-start'}`}
      >
        <Logo
          className={`${isDesktopSidebarCollapsed ? 'h-6 w-6 text-primary' : 'h-6 w-6'} shrink-0`}
        />
        {!isDesktopSidebarCollapsed && (
          <h1 className='ml-3 flex-1 min-w-0 text-xl font-bold text-foreground truncate'>
            Streamline Suite
          </h1>
        )}
      </div>
      <div className='flex-1 overflow-y-auto overflow-x-hidden p-4'>
        <nav className='space-y-2'>
          {filteredNavigationItems.map(item => (
            <NavLink key={item.name} item={item} />
          ))}
        </nav>
        <hr className='my-4 border-border' />
        <nav className='space-y-2'>
          {filteredSecondaryItems.map(item => (
            <NavLink key={item.name} item={item} />
          ))}
        </nav>
      </div>
      <div className='p-4 border-t border-border shrink-0'>
        <div
          className={`flex items-center ${isDesktopSidebarCollapsed ? 'flex-col space-y-2' : 'justify-between'}`}
        >
          <button
            onClick={() => {
              dispatch(setTheme(theme === 'light' ? 'dark' : 'light'))
            }}
            className='p-2 rounded-full text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors'
            title='Toggle theme'
          >
            {theme === 'light' ? <MoonIcon className='w-5 h-5' /> : <SunIcon className='w-5 h-5' />}
          </button>
          <button
            onClick={onLogout}
            className={`flex items-center px-4 py-2 text-sm font-medium text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors ${isDesktopSidebarCollapsed ? 'w-full justify-center' : ''}`}
            title={isDesktopSidebarCollapsed ? 'Logout' : undefined}
          >
            <LogoutIcon className={`w-5 h-5 ${!isDesktopSidebarCollapsed ? 'mr-2' : ''}`} />
            {!isDesktopSidebarCollapsed && 'Logout'}
          </button>
        </div>
        {/* Desktop-only collapse button */}
        <div className='hidden md:block mt-4'>
          <button
            onClick={() => dispatch(setDesktopSidebarCollapsed(!isDesktopSidebarCollapsed))}
            className='w-full flex items-center justify-center p-2 text-sm font-medium text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors'
          >
            {isDesktopSidebarCollapsed ? (
              <ChevronDoubleRightIcon className='w-5 h-5' />
            ) : (
              <ChevronDoubleLeftIcon className='w-5 h-5' />
            )}
            {!isDesktopSidebarCollapsed && <span className='ml-2'>Collapse</span>}
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-30 md:hidden transition-opacity ${isMobileSidebarOpen ? 'block' : 'hidden'}`}
      >
        {/* Overlay */}
        <div
          className='absolute inset-0 bg-black/50 backdrop-blur-sm'
          onClick={() => dispatch(setMobileSidebarOpen(false))}
        ></div>
        {/* Sidebar */}
        <div
          className={`relative w-72 h-full transition-transform duration-300 ease-in-out bg-card ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          {sidebarContent}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex md:flex-col md:shrink-0 transition-all duration-300 ease-in-out border-r border-border bg-card ${isDesktopSidebarCollapsed ? 'w-20' : 'w-72'}`}
      >
        {sidebarContent}
      </aside>
    </>
  )
}

export default Sidebar
