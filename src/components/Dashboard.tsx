'use client'
import React, { useEffect } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  ArrowUpIcon,
  ClockIcon,
  CurrencyDollarIcon,
  DocumentReportIcon,
  ExclamationIcon,
  ShoppingCartIcon,
} from './Icons'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { fetchDashboardStatsAction } from '@/store/slices/dashboard/actions'

const StatCard: React.FC<{
  title: string
  value: string
  change: string
  icon: React.ReactNode
}> = ({ title, value, change, icon }) => (
  <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col justify-between'>
    <div className='flex justify-between items-start'>
      <span className='text-gray-500 dark:text-gray-400 font-medium'>{title}</span>
      {icon}
    </div>
    <div>
      <p className='text-3xl font-bold text-gray-900 dark:text-white mt-2'>{value}</p>
      <div className='flex items-center mt-1 text-teal-500 dark:text-teal-400'>
        <ArrowUpIcon className='w-4 h-4' />
        <span className='ml-1 text-sm'>{change}</span>
      </div>
    </div>
  </div>
)

const COLORS = ['#14B8A6', '#3B82F6', '#F97316', '#F59E0B', '#EF4444']

// Helper function to format period labels
const formatPeriodLabel = (period: string) => {
  const [year, month] = period.split('-')
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  return `${monthNames[parseInt(month) - 1]} ${year}`
}

const Dashboard: React.FC = () => {
  const { user } = useAppSelector(state => state.authReducer)
  const { stats, isLoading, error } = useAppSelector(state => state.dashboardReducer)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchDashboardStatsAction())
  }, [dispatch])

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-center min-h-[400px]'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-teal-500'></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='space-y-6'>
        <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6'>
          <h3 className='text-lg font-semibold text-red-900 dark:text-red-100'>
            Error Loading Dashboard
          </h3>
          <p className='text-red-700 dark:text-red-300 mt-2'>{error}</p>
          <button
            onClick={() => dispatch(fetchDashboardStatsAction())}
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
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
          Welcome, {user?.account.name}!
        </h1>
        <p className='text-gray-500 dark:text-gray-400 mt-1'>
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
          value={stats ? `$${stats.totalRevenueYTD.toLocaleString()}` : '$0'}
          change={
            stats
              ? `${stats.growth.revenueGrowthPercent > 0 ? '+' : ''}${stats.growth.revenueGrowthPercent.toFixed(1)}% last month`
              : 'No data'
          }
          icon={<CurrencyDollarIcon className='w-7 h-7 text-gray-400 dark:text-gray-500' />}
        />
        <StatCard
          title='Outstanding Invoices'
          value={stats ? `$${stats.outstandingInvoices.total.toLocaleString()}` : '$0'}
          change={
            stats
              ? `${stats.outstandingInvoices.count} pending${stats.outstandingInvoices.overdue > 0 ? `, ${stats.outstandingInvoices.overdue} overdue` : ''}`
              : 'No data'
          }
          icon={<DocumentReportIcon className='w-7 h-7 text-gray-400 dark:text-gray-500' />}
        />
        <StatCard
          title='Weekly Quotations'
          value={stats ? stats.weeklyQuotations.total.count.toString() : '0'}
          change={
            stats ? `$${stats.weeklyQuotations.total.value.toLocaleString()} value` : 'No data'
          }
          icon={<ShoppingCartIcon className='w-7 h-7 text-gray-400 dark:text-gray-500' />}
        />
      </div>

      {/* Charts */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
            Sales Over Time
          </h3>
          {!stats?.salesTrend || stats.salesTrend.length === 0 ? (
            <p className='text-gray-500 dark:text-gray-400'>No sales trend data available.</p>
          ) : (
            <ResponsiveContainer width='100%' height={300}>
              <LineChart
                data={
                  stats?.salesTrend?.map(item => ({
                    name: formatPeriodLabel(item.period),
                    sales: item.revenue,
                    profit: item.profit,
                  })) || []
                }
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray='3 3' stroke='#4B5563' />
                <XAxis dataKey='name' stroke='#6B7280' />
                <YAxis stroke='#6B7280' />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                  itemStyle={{ color: '#E5E7EB' }}
                />
                <Legend wrapperStyle={{ color: '#E5E7EB' }} />
                <Line
                  type='monotone'
                  dataKey='sales'
                  stroke='#14B8A6'
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#14B8A6' }}
                  activeDot={{ r: 8, stroke: '#10B981' }}
                  name='Revenue'
                />
                <Line
                  type='monotone'
                  dataKey='profit'
                  stroke='#3B82F6'
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#3B82F6' }}
                  activeDot={{ r: 8, stroke: '#2563EB' }}
                  name='Profit'
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col items-center'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4 self-start'>
            Top Selling Items
          </h3>
          {!stats?.topProducts || stats.topProducts.length === 0 ? (
            <p className='text-gray-500 dark:text-gray-400'>No top selling items data available.</p>
          ) : (
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={
                    stats?.topProducts?.slice(0, 5).map(product => ({
                      name: product.name,
                      value: product.revenue,
                    })) || []
                  }
                  cx='50%'
                  cy='50%'
                  innerRadius={60}
                  outerRadius={80}
                  fill='#8884d8'
                  paddingAngle={5}
                  dataKey='value'
                  nameKey='name'
                >
                  {(stats?.topProducts?.slice(0, 5) || []).map((entry, index) => (
                    <Cell key={`cell-${index + 1}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                  itemStyle={{ color: '#E5E7EB' }}
                />
                <Legend wrapperStyle={{ color: '#9CA3AF' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Activities and Alerts */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
            Recent Activities
          </h3>
          <ul className='space-y-4'>
            {stats?.recentActivities && stats?.recentActivities?.length > 0 ? (
              stats.recentActivities?.slice(0, 5).map(activity => (
                <li key={activity.id} className='flex items-start'>
                  <div className='bg-gray-100 dark:bg-gray-700 p-2 rounded-full mr-4 mt-1'>
                    <ClockIcon className='w-5 h-5 text-teal-500 dark:text-teal-400' />
                  </div>
                  <div>
                    <p className='text-gray-800 dark:text-white text-sm'>{activity.text}</p>
                    <p className='text-gray-500 dark:text-gray-400 text-xs'>
                      {activity.time}
                      {/* {new Date(activity.createdAt).toLocaleString()} */}
                    </p>
                  </div>
                </li>
              ))
            ) : (
              <li className='text-gray-500 dark:text-gray-400 text-sm'>No recent activities</li>
            )}
          </ul>
        </div>
        <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
            Low Stock Alerts
          </h3>
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
                      <p className='text-gray-800 dark:text-white text-sm'>
                        {product.name} (Qty: {product.currentStock})
                      </p>
                      <p className='text-gray-500 dark:text-gray-400 text-xs'>
                        Alert level: {product.lowStockAlert}
                      </p>
                    </div>
                  </li>
                )
              })
            ) : (
              <li className='text-gray-500 dark:text-gray-400 text-sm'>No low stock alerts</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
