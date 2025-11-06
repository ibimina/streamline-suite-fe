'use client'
import React from 'react'
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
import { CurrencyDollarIcon, PresentationChartLineIcon, UsersIcon } from './Icons'

const kpiData = [
  {
    title: 'Total Revenue',
    value: '$525,300',
    change: '+15.2% vs last period',
    icon: <CurrencyDollarIcon className='w-7 h-7 text-gray-400 dark:text-gray-500' />,
  },
  {
    title: 'Net Profit',
    value: '$128,450',
    change: '+8.8% vs last period',
    icon: <PresentationChartLineIcon className='w-7 h-7 text-gray-400 dark:text-gray-500' />,
  },
  {
    title: 'Avg. Sale Value',
    value: '$4,825',
    change: '+$250 vs last period',
    icon: <UsersIcon className='w-7 h-7 text-gray-400 dark:text-gray-500' />,
  },
]

const revenueProfitData = [
  { name: 'Jan', revenue: 45000, profit: 12000 },
  { name: 'Feb', revenue: 42000, profit: 11000 },
  { name: 'Mar', revenue: 61000, profit: 18000 },
  { name: 'Apr', revenue: 55000, profit: 15500 },
  { name: 'May', revenue: 72000, profit: 21000 },
  { name: 'Jun', revenue: 68000, profit: 19500 },
]

const salesByServiceData = [
  { name: 'IT Equipment', sales: 250000 },
  { name: 'Installations', sales: 180000 },
  { name: 'Consulting', sales: 95300 },
]

const topCustomersData = [
  { name: 'Global Corp', value: 150000 },
  { name: 'Tech Solutions', value: 110000 },
  { name: 'Innovate Inc.', value: 85000 },
  { name: 'Others', value: 180300 },
]

const COLORS = ['#14B8A6', '#3B82F6', '#F97316', '#6B7280']

const StatCard: React.FC<{
  title: string
  value: string
  change: string
  icon: React.ReactNode
}> = ({ title, value, change, icon }) => (
  <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg'>
    <div className='flex justify-between items-start'>
      <span className='text-gray-500 dark:text-gray-400 font-medium'>{title}</span>
      {icon}
    </div>
    <p className='text-3xl font-bold text-gray-900 dark:text-white mt-2'>{value}</p>
    <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>{change}</p>
  </div>
)

const Analytics: React.FC = () => {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>Analytics & Reporting</h1>
        <p className='text-gray-500 dark:text-gray-400 mt-1'>
          Deep dive into your business performance.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {kpiData.map(kpi => (
          <StatCard key={kpi.title} {...kpi} />
        ))}
      </div>

      <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
          Revenue vs. Profit
        </h3>
        <ResponsiveContainer width='100%' height={350}>
          <LineChart data={revenueProfitData}>
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
              dataKey='revenue'
              stroke='#3B82F6'
              strokeWidth={2}
              name='Revenue'
            />
            <Line type='monotone' dataKey='profit' stroke='#14B8A6' strokeWidth={2} name='Profit' />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
            Sales by Service/Product
          </h3>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart
              data={salesByServiceData}
              layout='vertical'
              margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray='3 3' stroke='#4B5563' />
              <XAxis type='number' stroke='#6B7280' />
              <YAxis type='category' dataKey='name' stroke='#6B7280' width={100} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                itemStyle={{ color: '#E5E7EB' }}
                cursor={{ fill: 'rgba(107, 114, 128, 0.2)' }}
              />
              <Legend wrapperStyle={{ color: '#E5E7EB' }} />
              <Bar dataKey='sales' fill='#14B8A6' name='Total Sales' />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col items-center'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4 self-start'>
            Top Customers by Revenue
          </h3>
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
                labelLine={false} // Fix: Add explicit `any` type for label renderer props to resolve library typing issue.
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
                  <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                itemStyle={{ color: '#E5E7EB' }}
              />
              <Legend wrapperStyle={{ color: '#9CA3AF' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default Analytics
