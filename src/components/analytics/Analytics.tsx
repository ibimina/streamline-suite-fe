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
import { useGetDashboardStatsQuery } from '@/store/api'
import { DateFilter } from '../ui/date-filter'
import { useChartColors, useChartColorArray } from '@/hooks/useChartColors'

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

  // Pass date range to query when backend supports it
  const { data, isLoading, isError, refetch } = useGetDashboardStatsQuery()
  const stats = data?.payload

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const kpiData = useMemo(() => {
    if (!stats) return []

    const avgSaleValue =
      stats.totalInvoicesYTD > 0 ? stats.totalRevenueYTD / stats.totalInvoicesYTD : 0

    return [
      {
        title: 'Total Revenue',
        value: formatCurrency(stats.totalRevenueYTD),
        change: `${stats.growth?.revenueGrowthPercent >= 0 ? '+' : ''}${(stats.growth?.revenueGrowthPercent || 0).toFixed(1)}% vs last period`,
        icon: <CurrencyDollarIcon className='w-7 h-7 text-muted-foreground' />,
      },
      {
        title: 'Net Profit',
        value: formatCurrency(stats.totalProfitYTD),
        change: `${(stats.profitMargin || 0).toFixed(1)}% profit margin`,
        icon: <PresentationChartLineIcon className='w-7 h-7 text-muted-foreground' />,
      },
      {
        title: 'Avg. Sale Value',
        value: formatCurrency(avgSaleValue),
        change: `${stats.totalInvoicesYTD} invoices YTD`,
        icon: <UsersIcon className='w-7 h-7 text-muted-foreground' />,
      },
    ]
  }, [stats])

  // Prepare revenue/profit trend data
  const salesTrend = stats?.salesTrend
  const revenueProfitData = useMemo(() => {
    if (!salesTrend) return []
    return salesTrend.map(item => ({
      name: item.period,
      revenue: item.revenue,
      profit: item.profit,
    }))
  }, [salesTrend])

  const topProducts = stats?.topProducts
  const salesByServiceData = useMemo(() => {
    if (!topProducts) return []
    return topProducts.slice(0, 5).map(product => ({
      name: product.name,
      sales: product.revenue,
    }))
  }, [topProducts])

  const topCustomersData = useMemo(() => {
    if (!topProducts) return []
    const total = topProducts.reduce((sum, p) => sum + p.revenue, 0)
    const topItems = topProducts.slice(0, 3).map(p => ({
      name: p.name,
      value: p.revenue,
    }))
    const othersValue = total - topItems.reduce((sum, item) => sum + item.value, 0)
    if (othersValue > 0) {
      topItems.push({ name: 'Others', value: othersValue })
    }
    return topItems
  }, [topProducts])

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
          <h3 className='text-lg font-semibold text-foreground mb-4'>Top Products by Revenue</h3>
          {isLoading ? (
            <div className='h-75 flex items-center justify-center'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary' />
            </div>
          ) : salesByServiceData.length > 0 ? (
            <ResponsiveContainer width='100%' height={300}>
              <BarChart
                data={salesByServiceData}
                layout='vertical'
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray='3 3' className='stroke-border' />
                <XAxis type='number' className='fill-muted-foreground' />
                <YAxis
                  type='category'
                  dataKey='name'
                  className='fill-muted-foreground'
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                  cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
                />
                <Legend wrapperStyle={{ color: 'hsl(var(--muted-foreground))' }} />
                <Bar dataKey='sales' fill={chartColors.primary} name='Revenue' />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className='h-75 flex items-center justify-center text-muted-foreground'>
              No product data available
            </div>
          )}
        </div>
        <div className='bg-card p-6 rounded-xl shadow-lg flex flex-col items-center'>
          <h3 className='text-lg font-semibold text-foreground mb-4 self-start'>
            Revenue Distribution
          </h3>
          {isLoading ? (
            <div className='h-75 flex items-center justify-center'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary' />
            </div>
          ) : topCustomersData.length > 0 ? (
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={topCustomersData}
                  cx='50%'
                  cy='50%'
                  outerRadius={100}
                  fill='#8884d8'
                  dataKey='value'
                  nameKey='name'
                  labelLine={false}
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
                    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180))
                    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180))
                    return (
                      <text
                        x={x}
                        y={y}
                        fill='white'
                        textAnchor={x > cx ? 'start' : 'end'}
                        dominantBaseline='central'
                      >
                        {`${(percent * 100).toFixed(0)}%`}
                      </text>
                    )
                  }}
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
