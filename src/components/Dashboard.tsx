"use client"
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { ArrowUpIcon, ClockIcon, CurrencyDollarIcon, DocumentReportIcon, ExclamationIcon, ShoppingCartIcon } from './Icons';

const StatCard: React.FC<{
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}> = ({ title, value, change, icon }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col justify-between">
    <div className="flex justify-between items-start">
      <span className="text-gray-500 dark:text-gray-400 font-medium">{title}</span>
      {icon}
    </div>
    <div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
      <div className="flex items-center mt-1 text-teal-500 dark:text-teal-400">
        <ArrowUpIcon className="w-4 h-4" />
        <span className="ml-1 text-sm">{change}</span>
      </div>
    </div>
  </div>
);

const salesData = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 4500 },
  { name: 'May', sales: 6000 },
  { name: 'Jun', sales: 5500 },
];

const topSellingData = [
  { name: 'Servers', value: 45 },
  { name: 'Laptops', value: 30 },
  { name: 'Cameras', value: 25 },
];
const COLORS = ['#14B8A6', '#3B82F6', '#F97316'];

const recentActivities = [
    { text: "Quotation #Q-2023-005 accepted by Tech Solutions", time: "4 hours ago" },
    { text: "New IT Equipment added: Dell PowerEdge 7750", time: "1 day ago" },
    { text: "Invoice #INV-2023-10 sent to Global Corp.", time: "yesterday" },
];

const lowStockAlerts = [
    { text: "Ethernet Cables (Qty: 15)", critical: false },
    { text: "CCTV Camera ProView Biometric Reader (5)", critical: true },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome, Business Owner!</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Sales" value="$450,000" change="+12% last month" icon={<CurrencyDollarIcon className="w-7 h-7 text-gray-400 dark:text-gray-500"/>} />
        <StatCard title="Outstanding Invoices" value="$75,000" change="9 pending" icon={<DocumentReportIcon className="w-7 h-7 text-gray-400 dark:text-gray-500"/>} />
        <StatCard title="New Quotations" value="15" change="+5 this week" icon={<ShoppingCartIcon className="w-7 h-7 text-gray-400 dark:text-gray-500"/>} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sales Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} itemStyle={{ color: '#E5E7EB' }} />
              <Legend wrapperStyle={{color: "#E5E7EB"}}/>
              <Line type="monotone" dataKey="sales" stroke="#14B8A6" strokeWidth={2} dot={{ r: 4, fill: '#14B8A6' }} activeDot={{ r: 8, stroke: '#10B981' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 self-start">Top Selling Items</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={topSellingData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                    >
                        {topSellingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} itemStyle={{ color: '#E5E7EB' }} />
                    <Legend wrapperStyle={{color: "#9CA3AF"}}/>
                </PieChart>
            </ResponsiveContainer>
        </div>
      </div>
      
      {/* Activities and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activities</h3>
            <ul className="space-y-4">
              {recentActivities.map((activity, index) => (
                  <li key={index} className="flex items-start">
                      <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full mr-4 mt-1">
                          <ClockIcon className="w-5 h-5 text-teal-500 dark:text-teal-400" />
                      </div>
                      <div>
                          <p className="text-gray-800 dark:text-white text-sm">{activity.text}</p>
                          <p className="text-gray-500 dark:text-gray-400 text-xs">{activity.time}</p>
                      </div>
                  </li>
              ))}
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Low Stock Alerts</h3>
             <ul className="space-y-4">
              {lowStockAlerts.map((alert, index) => (
                  <li key={index} className="flex items-start">
                       <div className={`p-2 rounded-full mr-4 mt-1 ${alert.critical ? 'bg-red-500/20' : 'bg-yellow-500/20'}`}>
                          <ExclamationIcon className={`w-5 h-5 ${alert.critical ? 'text-red-500 dark:text-red-400' : 'text-yellow-500 dark:text-yellow-400'}`} />
                      </div>
                      <div>
                          <p className="text-gray-800 dark:text-white text-sm">{alert.text}</p>
                      </div>
                  </li>
              ))}
            </ul>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;