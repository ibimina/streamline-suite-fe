'use client'
import React, { useMemo, useState } from 'react'
import { DateRange } from 'react-day-picker'
import {
  Bar,
  BarChart,
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
import { CurrencyDollarIcon, PresentationChartLineIcon, UsersIcon } from '../Icons'
import { useGetAnalyticsQuery } from '@/store/api'
import { DateFilter } from '../ui/date-filter'
import { useChartColors, useChartColorArray } from '@/hooks/useChartColors'
import { useCurrency } from '@/hooks/useCurrency'

const StatCard: React.FC<{
  title: string
  value: string
  change: string
  icon: React.ReactNode
  isLoading?: boolean
}> = ({ title, value, change, icon, isLoading }) => (
  <div className='bg-card p-6 rounded-xl shadow-lg'>
    <div className='flex justify-between items-start'>
      <span className='text-muted-foreground font-medium'>{title}</span>
      {icon}
    </div>
    {isLoading ? (
      <>
        <div className='h-9 mt-2 bg-muted animate-pulse rounded w-32' />
        <div className='h-4 mt-2 bg-muted animate-pulse rounded w-24' />
      </>
    ) : (
      <>
        <p className='text-3xl font-bold text-foreground mt-2'>{value}</p>
        <p className='text-sm text-muted-foreground mt-1'>{change}</p>
      </>
    )}
  </div>
)

const Analytics: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const chartColors = useChartColors()
  const colorArray = useChartColorArray()
  const { formatCurrency } = useCurrency()

  // Use the dedicated analytics API
  const { data, isLoading, isError, refetch } = useGetAnalyticsQuery()
  const stats = data?.payload

  const kpis = stats?.kpis
  const kpiData = useMemo(() => {
    if (!kpis) return []

    return [
      {
        title: 'Total Revenue',
        value: formatCurrency(kpis.totalRevenue),
        change: `${kpis.revenueChange >= 0 ? '+' : ''}${(kpis.revenueChange || 0).toFixed(1)}% vs last period`,
        icon: <CurrencyDollarIcon className='w-7 h-7 text-muted-foreground' />,
      },
      {
        title: 'Net Profit',
        value: formatCurrency(kpis.totalProfit),
        change: `${kpis.profitChange >= 0 ? '+' : ''}${(kpis.profitChange || 0).toFixed(1)}% vs last period`,
        icon: <PresentationChartLineIcon className='w-7 h-7 text-muted-foreground' />,
      },
      {
        title: 'Avg. Sale Value',
        value: formatCurrency(kpis.averageSaleValue),
        change: `${kpis.avgSaleChange >= 0 ? '+' : ''}${(kpis.avgSaleChange || 0).toFixed(1)}% vs last period`,
        icon: <UsersIcon className='w-7 h-7 text-muted-foreground' />,
      },
    ]
  }, [kpis, formatCurrency])

  // Prepare revenue/profit trend data
  const revenueProfitTrend = stats?.revenueProfitTrend
  const revenueProfitData = useMemo(() => {
    if (!revenueProfitTrend) return []
    return revenueProfitTrend.map(item => ({
      name: item.month,
      revenue: item.revenue,
      profit: item.profit,
    }))
  }, [revenueProfitTrend])

  // Sales by service for bar chart
  const salesByService = stats?.salesByService
  const salesByServiceData = useMemo(() => {
    if (!salesByService) return []
    return salesByService
  }, [salesByService])

  // Top customers for pie chart
  const topCustomers = stats?.topCustomers
  const topCustomersData = useMemo(() => {
    if (!topCustomers) return []
    return topCustomers
  }, [topCustomers])

  if (isError) {
    return (
      <div className='text-center py-12'>
        <p className='text-red-500 mb-4'>Failed to load analytics data</p>
        <button
          onClick={() => refetch()}
          className='bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary'
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>Analytics & Reporting</h1>
          <p className='text-muted-foreground mt-1'>Deep dive into your business performance.</p>
        </div>
        <DateFilter value={dateRange} onChange={setDateRange} />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {isLoading ? (
          <>
            <StatCard
              title='Total Revenue'
              value=''
              change=''
              icon={<CurrencyDollarIcon className='w-7 h-7 text-muted-foreground' />}
              isLoading
            />
            <StatCard
              title='Net Profit'
              value=''
              change=''
              icon={<PresentationChartLineIcon className='w-7 h-7 text-muted-foreground' />}
              isLoading
            />
            <StatCard
              title='Avg. Sale Value'
              value=''
              change=''
              icon={<UsersIcon className='w-7 h-7 text-muted-foreground' />}
              isLoading
            />
          </>
        ) : (
          kpiData.map(kpi => <StatCard key={kpi.title} {...kpi} />)
        )}
      </div>

      <div className='bg-card p-6 rounded-xl shadow-lg'>
        <h3 className='text-lg font-semibold text-foreground mb-4'>Revenue vs. Profit</h3>
        {isLoading ? (
          <div className='h-87.5 flex items-center justify-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary' />
          </div>
        ) : revenueProfitData.length > 0 ? (
          <ResponsiveContainer width='100%' height={350}>
            <LineChart data={revenueProfitData}>
              <CartesianGrid strokeDasharray='3 3' className='stroke-border' />
              <XAxis dataKey='name' className='fill-muted-foreground' />
              <YAxis className='fill-muted-foreground' />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend wrapperStyle={{ color: 'hsl(var(--muted-foreground))' }} />
              <Line
                type='monotone'
                dataKey='revenue'
                stroke={chartColors.primary}
                strokeWidth={2}
                name='Revenue'
              />
              <Line
                type='monotone'
                dataKey='profit'
                stroke={chartColors.success}
                strokeWidth={2}
                name='Profit'
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className='h-87.5 flex items-center justify-center text-muted-foreground'>
            No trend data available
          </div>
        )}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='bg-card p-6 rounded-xl shadow-lg'>
          <h3 className='text-lg font-semibold text-foreground mb-4'>Sales by Service</h3>
          {isLoading ? (
            <div className='h-75 flex items-center justify-center'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary' />
            </div>
          ) : salesByServiceData.length > 0 ? (
            <ResponsiveContainer width='100%' height={300}>
              <BarChart
                data={salesByServiceData}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray='3 3' className='stroke-border' />
                <XAxis dataKey='name' className='fill-muted-foreground' />
                <YAxis className='fill-muted-foreground' />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                  cursor={{ fill: 'transparent' }}
                />
                <Legend wrapperStyle={{ color: 'hsl(var(--muted-foreground))' }} />
                <Bar
                  dataKey='sales'
                  fill={chartColors.primary}
                  name='Revenue'
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className='h-75 flex items-center justify-center text-muted-foreground'>
              No service data available
            </div>
          )}
        </div>
        <div className='bg-card p-6 rounded-xl shadow-lg flex flex-col items-center'>
          <h3 className='text-lg font-semibold text-foreground mb-4 self-start'>Top Customers</h3>
          {isLoading ? (
            <div className='h-75 flex items-center justify-center'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary' />
            </div>
          ) : topCustomersData.length > 0 ? (
            <ResponsiveContainer width='100%' height={350}>
              <PieChart>
                <Pie
                  data={topCustomersData}
                  cx='50%'
                  cy='45%'
                  outerRadius={80}
                  fill='#8884d8'
                  dataKey='value'
                  nameKey='name'
                  label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                  labelLine={true}
                >
                  {topCustomersData.map((entry, index) => (
                    <Cell key={`cell-${entry.name}`} fill={colorArray[index % colorArray.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend wrapperStyle={{ color: 'hsl(var(--muted-foreground))' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className='h-75 flex items-center justify-center text-muted-foreground'>
              No distribution data available
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Analytics
