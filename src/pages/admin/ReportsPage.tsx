import React, { useState } from 'react';
import { BarChart, FileText, Download, PieChart, LineChart } from 'lucide-react';
import { toast } from 'sonner';

const ReportsPage = () => {
  const [selectedReport, setSelectedReport] = useState<'sales' | 'products' | 'customers'>('sales');
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [loading, setLoading] = useState(false);

  // Reports data would be fetched from Firestore
  // Using mock data for now
  const salesData = [
    { month: 'Jan', sales: 4000 },
    { month: 'Feb', sales: 4500 },
    { month: 'Mar', sales: 6000 },
    { month: 'Apr', sales: 5500 },
    { month: 'May', sales: 7000 },
    { month: 'Jun', sales: 6800 },
    { month: 'Jul', sales: 7200 },
    { month: 'Aug', sales: 7800 },
    { month: 'Sep', sales: 8200 },
    { month: 'Oct', sales: 8500 },
    { month: 'Nov', sales: 9000 },
    { month: 'Dec', sales: 9500 },
  ];

  const topProducts = [
    { name: 'Apple Mint 6mg', sales: 245, revenue: 6100 },
    { name: 'Cool Mint 12mg', sales: 187, revenue: 5050 },
    { name: 'Berry 6mg', sales: 164, revenue: 4100 },
    { name: 'Citrus 12mg', sales: 135, revenue: 3650 },
    { name: 'Coffee 6mg', sales: 121, revenue: 3025 },
  ];

  const customerSegments = [
    { segment: 'Retail', count: 120, percentage: 60 },
    { segment: 'Wholesale', count: 45, percentage: 22.5 },
    { segment: 'Distributors', count: 35, percentage: 17.5 },
  ];

  const downloadReport = () => {
    setLoading(true);
    
    // Simulate download delay
    setTimeout(() => {
      setLoading(false);
      toast.success(`${selectedReport.charAt(0).toUpperCase() + selectedReport.slice(1)} report downloaded`);
    }, 1500);
  };

  const renderSalesReport = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-surface-800 shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-4">Monthly Sales Overview</h3>
        
        {/* This would be a real chart in production */}
        <div className="h-64 bg-surface-50 dark:bg-surface-700 rounded flex items-center justify-center">
          <div className="w-full px-4">
            <div className="flex h-40 items-end justify-between">
              {salesData.map((item) => (
                <div key={item.month} className="flex flex-col items-center">
                  <div 
                    className="w-8 bg-primary-500 rounded-t"
                    style={{ height: `${(item.sales / 10000) * 100}%` }}
                  ></div>
                  <span className="text-xs mt-2 text-surface-600 dark:text-surface-400">{item.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-surface-800 shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-4">Sales Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface-50 dark:bg-surface-700 rounded p-4">
            <div className="text-sm text-surface-500 dark:text-surface-400">Total Sales</div>
            <div className="text-2xl font-bold text-surface-900 dark:text-white mt-1">$78,500</div>
            <div className="text-xs text-green-500 mt-1">↑ 12% from last period</div>
          </div>
          
          <div className="bg-surface-50 dark:bg-surface-700 rounded p-4">
            <div className="text-sm text-surface-500 dark:text-surface-400">Orders</div>
            <div className="text-2xl font-bold text-surface-900 dark:text-white mt-1">1,245</div>
            <div className="text-xs text-green-500 mt-1">↑ 8.5% from last period</div>
          </div>
          
          <div className="bg-surface-50 dark:bg-surface-700 rounded p-4">
            <div className="text-sm text-surface-500 dark:text-surface-400">Average Order Value</div>
            <div className="text-2xl font-bold text-surface-900 dark:text-white mt-1">$63.05</div>
            <div className="text-xs text-green-500 mt-1">↑ 3.2% from last period</div>
          </div>
          
          <div className="bg-surface-50 dark:bg-surface-700 rounded p-4">
            <div className="text-sm text-surface-500 dark:text-surface-400">Conversion Rate</div>
            <div className="text-2xl font-bold text-surface-900 dark:text-white mt-1">4.8%</div>
            <div className="text-xs text-green-500 mt-1">↑ 0.6% from last period</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProductsReport = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-surface-800 shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-4">Top Selling Products</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Units Sold</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">% of Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-surface-200 dark:bg-surface-800 dark:divide-surface-700">
              {topProducts.map((product, index) => (
                <tr key={index} className="hover:bg-surface-50 dark:hover:bg-surface-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900 dark:text-white">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-700 dark:text-surface-300">{product.sales}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-700 dark:text-surface-300">${product.revenue}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-700 dark:text-surface-300">
                    {Math.round((product.revenue / 21925) * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-white dark:bg-surface-800 shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-4">Product Category Distribution</h3>
        
        {/* This would be a real pie chart in production */}
        <div className="h-64 bg-surface-50 dark:bg-surface-700 rounded flex items-center justify-center">
          <div className="relative w-40 h-40">
            <div className="absolute inset-0 rounded-full border-8 border-primary-500" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 0)' }}></div>
            <div className="absolute inset-0 rounded-full border-8 border-blue-500" style={{ clipPath: 'polygon(50% 50%, 0 0, 100% 0)' }}></div>
            <div className="absolute inset-0 rounded-full border-8 border-green-500" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 50%)' }}></div>
          </div>
        </div>
        
        <div className="flex justify-center mt-4 space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-primary-500 rounded-full mr-2"></div>
            <span className="text-sm text-surface-700 dark:text-surface-300">Nicotine Pouches (65%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm text-surface-700 dark:text-surface-300">Accessories (20%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-surface-700 dark:text-surface-300">Other (15%)</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCustomersReport = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-surface-800 shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-4">Customer Segments</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {customerSegments.map((segment) => (
            <div key={segment.segment} className="bg-surface-50 dark:bg-surface-700 rounded p-4">
              <div className="text-lg font-medium text-surface-900 dark:text-white">{segment.segment}</div>
              <div className="text-2xl font-bold text-surface-900 dark:text-white mt-1">{segment.count}</div>
              <div className="text-sm text-surface-500 dark:text-surface-400 mt-1">{segment.percentage}% of total</div>
              
              <div className="w-full bg-surface-200 dark:bg-surface-600 rounded-full h-2.5 mt-3">
                <div 
                  className="bg-primary-500 h-2.5 rounded-full" 
                  style={{ width: `${segment.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white dark:bg-surface-800 shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-4">Customer Growth</h3>
        
        {/* This would be a real line chart in production */}
        <div className="h-64 bg-surface-50 dark:bg-surface-700 rounded flex items-center justify-center">
          <div className="w-full px-4 relative">
            <div className="h-40 flex items-end">
              <div className="absolute inset-0 flex items-end">
                <svg viewBox="0 0 600 160" className="w-full h-full">
                  <path
                    d="M0,160 L50,140 L100,145 L150,135 L200,130 L250,120 L300,100 L350,90 L400,80 L450,65 L500,50 L550,30 L600,20"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-surface-50 dark:bg-surface-700 rounded p-4">
            <div className="text-sm text-surface-500 dark:text-surface-400">New Customers</div>
            <div className="text-2xl font-bold text-surface-900 dark:text-white mt-1">37</div>
            <div className="text-xs text-green-500 mt-1">↑ 18% from last period</div>
          </div>
          
          <div className="bg-surface-50 dark:bg-surface-700 rounded p-4">
            <div className="text-sm text-surface-500 dark:text-surface-400">Customer Retention</div>
            <div className="text-2xl font-bold text-surface-900 dark:text-white mt-1">78%</div>
            <div className="text-xs text-green-500 mt-1">↑ 5% from last period</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSelectedReport = () => {
    switch (selectedReport) {
      case 'sales':
        return renderSalesReport();
      case 'products':
        return renderProductsReport();
      case 'customers':
        return renderCustomersReport();
      default:
        return renderSalesReport();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-surface-800 shadow rounded-lg">
        <div className="px-6 py-5 border-b border-surface-200 dark:border-surface-700">
          <div className="flex flex-wrap justify-between items-center">
            <h3 className="text-lg font-medium text-surface-900 dark:text-white flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary-500" />
              Business Reports
            </h3>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as 'week' | 'month' | 'quarter' | 'year')}
                className="input text-sm"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
              <button 
                onClick={downloadReport}
                disabled={loading}
                className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 dark:bg-primary-700 dark:hover:bg-primary-600"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-1"></div>
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-1" />
                    Export Report
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 border-b border-surface-200 dark:border-surface-700">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedReport('sales')}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                selectedReport === 'sales'
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                  : 'text-surface-600 hover:text-surface-800 dark:text-surface-400 dark:hover:text-surface-200'
              }`}
            >
              <BarChart className="h-4 w-4 mr-1.5" />
              Sales Reports
            </button>
            <button
              onClick={() => setSelectedReport('products')}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                selectedReport === 'products'
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                  : 'text-surface-600 hover:text-surface-800 dark:text-surface-400 dark:hover:text-surface-200'
              }`}
            >
              <PieChart className="h-4 w-4 mr-1.5" />
              Product Reports
            </button>
            <button
              onClick={() => setSelectedReport('customers')}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                selectedReport === 'customers'
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                  : 'text-surface-600 hover:text-surface-800 dark:text-surface-400 dark:hover:text-surface-200'
              }`}
            >
              <LineChart className="h-4 w-4 mr-1.5" />
              Customer Reports
            </button>
          </div>
        </div>
      </div>
      
      {renderSelectedReport()}
    </div>
  );
};

export default ReportsPage;