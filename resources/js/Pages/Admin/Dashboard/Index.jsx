import React, { useState } from "react";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Download,
  Filter,
  MoreVertical,
  ArrowUpRight,
  TrendingDown,
  MessageSquare,
  UserCog,
  Award,
} from "lucide-react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const lineChartData = [
  { name: "Jan", revenue: 4000, orders: 2400, expenses: 3200 },
  { name: "Feb", revenue: 3000, orders: 1398, expenses: 2800 },
  { name: "Mar", revenue: 5000, orders: 3800, expenses: 3600 },
  { name: "Apr", revenue: 2780, orders: 3908, expenses: 2980 },
  { name: "May", revenue: 5890, orders: 4800, expenses: 4200 },
  { name: "Jun", revenue: 3390, orders: 3800, expenses: 3100 },
  { name: "Jul", revenue: 4490, orders: 4300, expenses: 3800 },
];

const pieChartData = [
  { name: "Electronics", value: 400, color: "#0088FE" },
  { name: "Clothing", value: 300, color: "#00C49F" },
  { name: "Food", value: 300, color: "#FFBB28" },
  { name: "Books", value: 200, color: "#FF8042" },
];

const modules = [
  { name: "E-commerce", icon: ShoppingCart },
  { name: "LMS", icon: Package },
  { name: "ERP", icon: Users },
  { name: "SaaS", icon: DollarSign },
];

function StatCard({ title, value, change, icon: Icon, trend }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <Icon className="h-6 w-6 text-gray-400" />
      </div>
      <div className="flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          {value}
        </p>
        <p
          className={`ml-2 flex items-baseline text-sm font-semibold ${
            trend === "up"
              ? "text-green-600 dark:text-green-500"
              : "text-red-600 dark:text-red-500"
          }`}
        >
          {trend === "up" ? (
            <ArrowUpRight className="self-center flex-shrink-0 h-4 w-4 text-green-500 dark:text-green-400" />
          ) : (
            <TrendingDown className="self-center flex-shrink-0 h-4 w-4 text-red-500 dark:text-red-400" />
          )}
          <span className="sr-only">
            {trend === "up" ? "Increased" : "Decreased"} by
          </span>
          {change}
        </p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [activeModule, setActiveModule] = useState("E-commerce");
  const [chartView, setChartView] = useState("revenue");
  const [dateRange, setDateRange] = useState("This Week");

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          {activeModule} Dashboard
        </h2>
        <div className="flex flex-wrap gap-2">
          {modules.map((module) => (
            <button
              key={module.name}
              onClick={() => setActiveModule(module.name)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                activeModule === module.name
                  ? "bg-blue-500 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <module.icon className="h-4 w-4 mr-2 inline-block" />
              {module.name}
            </button>
          ))}
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="mb-6 flex justify-end">
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        >
          <option>Today</option>
          <option>This Week</option>
          <option>This Month</option>
          <option>This Year</option>
        </select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value="$166,959.00"
          change="+20.1%"
          icon={DollarSign}
          trend="up"
        />
        <StatCard
          title="Total Orders"
          value="38"
          change="+180.1%"
          icon={ShoppingCart}
          trend="up"
        />
        <StatCard
          title="Total Products"
          value="57"
          change="+19%"
          icon={Package}
          trend="up"
        />
        <StatCard
          title="Active Customers"
          value="10"
          change="+201"
          icon={Users}
          trend="up"
        />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Charts Section */}
        <div className="col-span-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            Sales Overview
          </h3>
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setChartView("revenue")}
              className={`px-4 py-2 rounded-md ${
                chartView === "revenue"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              } hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300`}
            >
              Revenue
            </button>
            <button
              onClick={() => setChartView("orders")}
              className={`px-4 py-2 rounded-md ${
                chartView === "orders"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              } hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300`}
            >
              Orders
            </button>
            <button
              onClick={() => setChartView("expenses")}
              className={`px-4 py-2 rounded-md ${
                chartView === "expenses"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              } hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300`}
            >
              Expenses
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {chartView === "revenue" && (
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.3}
                />
              )}
              {chartView === "orders" && (
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.3}
                />
              )}
              {chartView === "expenses" && (
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#EF4444"
                  fill="#EF4444"
                  fillOpacity={0.3}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart Section */}
        <div className="col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            Product Categories
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-colors duration-300">
        <div className="p-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Recent Orders
          </h3>
          <div className="flex space-x-2">
            <button className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors duration-300">
              <Download className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors duration-300">
              <Filter className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors duration-300">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {[
                {
                  id: "1234",
                  customer: "John Doe",
                  product: "Premium Headphones",
                  amount: "$299.99",
                  status: "Completed",
                },
                {
                  id: "1235",
                  customer: "Jane Smith",
                  product: "Wireless Mouse",
                  amount: "$49.99",
                  status: "Processing",
                },
                {
                  id: "1236",
                  customer: "Bob Johnson",
                  product: "Gaming Keyboard",
                  amount: "$129.99",
                  status: "Shipped",
                },
                {
                  id: "1237",
                  customer: "Alice Brown",
                  product: "USB-C Cable",
                  amount: "$19.99",
                  status: "Completed",
                },
                {
                  id: "1238",
                  customer: "Charlie Wilson",
                  product: "Smart Watch",
                  amount: "$199.99",
                  status: "Processing",
                },
              ].map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {order.product}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {order.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "Processing"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-2">
                      View
                    </button>
                    <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            Top Selling Products
          </h3>
          <div className="space-y-4">
            {[
              { name: "Premium Headphones", sales: 1234, revenue: "$61,700" },
              { name: "Wireless Mouse", sales: 987, revenue: "$49,350" },
              { name: "Gaming Keyboard", sales: 865, revenue: "$112,450" },
              { name: "Smart Watch", sales: 754, revenue: "$150,800" },
              { name: "USB-C Cable", sales: 652, revenue: "$13,040" },
            ].map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                    <Package className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {product.sales} sales
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {product.revenue}
                  </p>
                  <p className="text-sm text-green-500">
                    +{Math.floor(Math.random() * 10) + 1}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            Customer Satisfaction
          </h3>
          <div className="space-y-4">
            {[
              { name: "Very Satisfied", percentage: 68 },
              { name: "Satisfied", percentage: 25 },
              { name: "Neutral", percentage: 5 },
              { name: "Unsatisfied", percentage: 2 },
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {item.name}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {item.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            Recent Activities
          </h3>
          <div className="space-y-4">
            {[
              {
                icon: ShoppingCart,
                action: "New order placed",
                user: "John Doe",
                time: "2 minutes ago",
              },
              {
                icon: Package,
                action: "Product restocked",
                user: "Jane Smith",
                time: "15 minutes ago",
              },
              {
                icon: MessageSquare,
                action: "Customer support ticket resolved",
                user: "Support Team",
                time: "1 hour ago",
              },
              {
                icon: UserCog,
                action: "New user registered",
                user: "Alice Johnson",
                time: "3 hours ago",
              },
              {
                icon: Award,
                action: "Product review submitted",
                user: "Bob Wilson",
                time: "5 hours ago",
              },
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <activity.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.user} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
