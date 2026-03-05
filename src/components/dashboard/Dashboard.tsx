'use client'
import React from 'react'
import {
  ArrowUpIcon,
  ClockIcon,
  CurrencyDollarIcon,
  DocumentReportIcon,
  ExclamationIcon,
  ShoppingCartIcon,
} from '../Icons'
import { useAppSelector } from '@/store/hooks'
import { useGetDashboardStatsQuery } from '@/store/api'
import { useCurrency } from '@/hooks/useCurrency'
import LoadingSpinner from '../shared/LoadingSpinner'

const StatCard: React.FC<{
  title: string
  value: string
  change: string
  icon: React.ReactNode
}> = ({ title, value, change, icon }) => (
  <div className='bg-card p-6 rounded-xl shadow-lg flex flex-col justify-between'>
    <div className='flex justify-between items-start'>
      <span className='text-muted-foreground font-medium'>{title}</span>
      {icon}
    </div>
    <div>
      <p className='text-3xl font-bold text-foreground mt-2'>{value}</p>
      <div className='flex items-center mt-1 text-primary dark:text-primary'>
        <ArrowUpIcon className='w-4 h-4' />
        <span className='ml-1 text-sm'>{change}</span>
      </div>
    </div>
  </div>
)

const Dashboard: React.FC = () => {
  const { user } = useAppSelector(state => state.authReducer)
  const { data, isLoading, error, refetch } = useGetDashboardStatsQuery()
  const { formatCurrency } = useCurrency()
  const stats = data?.payload ?? null

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    const errorMessage =
      'status' in error ? ((error.data as any)?.message ?? 'An error occurred') : error.message
    return (
      <div className='space-y-6'>
        <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6'>
          <h3 className='text-lg font-semibold text-red-900 dark:text-red-100'>
            Error Loading Dashboard
          </h3>
          <p className='text-red-700 dark:text-red-300 mt-2'>{errorMessage}</p>
          <button
            onClick={() => refetch()}
            className='mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors'
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold text-foreground'>Welcome, {user?.account.name}!</h1>
        <p className='text-muted-foreground mt-1'>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Key Metrics */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <StatCard
          title='Total Sales (YTD)'
          value={stats ? formatCurrency(stats.totalRevenueYTD) : formatCurrency(0)}
          change={
            stats
              ? `${stats.growth.revenueGrowthPercent > 0 ? '+' : ''}${stats.growth.revenueGrowthPercent.toFixed(1)}% last month`
              : 'No data'
          }
          icon={<CurrencyDollarIcon className='w-7 h-7 text-muted-foreground' />}
        />
        <StatCard
          title='Outstanding Invoices'
          value={stats ? formatCurrency(stats.outstandingInvoices.total) : formatCurrency(0)}
          change={
            stats
              ? `${stats.outstandingInvoices.count} pending${stats.outstandingInvoices.overdue > 0 ? `, ${stats.outstandingInvoices.overdue} overdue` : ''}`
              : 'No data'
          }
          icon={<DocumentReportIcon className='w-7 h-7 text-muted-foreground' />}
        />
        <StatCard
          title='Weekly Quotations'
          value={stats ? stats.weeklyQuotations.total.count.toString() : '0'}
          change={stats ? `${formatCurrency(stats.weeklyQuotations.total.value)} value` : 'No data'}
          icon={<ShoppingCartIcon className='w-7 h-7 text-muted-foreground' />}
        />
      </div>

      {/* Activities and Alerts */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='bg-card p-6 rounded-xl shadow-lg'>
          <h3 className='text-lg font-semibold text-foreground mb-4'>Recent Activities</h3>
          <ul className='space-y-4'>
            {stats?.recentActivities && stats?.recentActivities?.length > 0 ? (
              stats.recentActivities?.slice(0, 5).map(activity => (
                <li key={activity.id} className='flex items-start'>
                  <div className='bg-muted  p-2 rounded-full mr-4 mt-1'>
                    <ClockIcon className='w-5 h-5 text-primary dark:text-primary' />
                  </div>
                  <div>
                    <p className='text-foreground text-sm'>{activity.text}</p>
                    <p className='text-muted-foreground text-xs'>
                      {activity.time}
                      {/* {new Date(activity.createdAt).toLocaleString()} */}
                    </p>
                  </div>
                </li>
              ))
            ) : (
              <li className='text-muted-foreground text-sm'>No recent activities</li>
            )}
          </ul>
        </div>
        <div className='bg-card p-6 rounded-xl shadow-lg'>
          <h3 className='text-lg font-semibold text-foreground mb-4'>Low Stock Alerts</h3>
          <ul className='space-y-4'>
            {stats?.lowStockProducts && stats?.lowStockProducts?.length > 0 ? (
              stats?.lowStockProducts.slice(0, 5).map(product => {
                const isCritical = product.currentStock <= product.lowStockAlert * 0.3
                return (
                  <li key={product.id} className='flex items-start'>
                    <div
                      className={`p-2 rounded-full mr-4 mt-1 ${isCritical ? 'bg-red-500/20' : 'bg-yellow-500/20'}`}
                    >
                      <ExclamationIcon
                        className={`w-5 h-5 ${isCritical ? 'text-red-500 dark:text-red-400' : 'text-yellow-500 dark:text-yellow-400'}`}
                      />
                    </div>
                    <div>
                      <p className='text-foreground text-sm'>
                        {product.name} (Qty: {product.currentStock})
                      </p>
                      <p className='text-muted-foreground text-xs'>
                        Alert level: {product.lowStockAlert}
                      </p>
                    </div>
                  </li>
                )
              })
            ) : (
              <li className='text-muted-foreground text-sm'>No low stock alerts</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
