import React, { useState, useEffect } from 'react';
import { CircleDollarSign, TrendingUp, TrendingDown, Calendar, Filter, Download, FileText } from 'lucide-react';
import { toast } from 'sonner';

// Types for financial data
interface Payment {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  method: 'bank' | 'crypto' | 'highRisk';
  date: Date;
}

interface FinancialStats {
  totalRevenue: number;
  pendingPayments: number;
  recentTransactions: number;
  growthRate: number;
}

const PaymentsOverview = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<FinancialStats>({
    totalRevenue: 0,
    pendingPayments: 0,
    recentTransactions: 0,
    growthRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'year'>('month');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('all');

  useEffect(() => {
    fetchPaymentData();
  }, [dateRange, selectedPaymentMethod]);

  const fetchPaymentData = async () => {
    setLoading(true);
    
    // This would be a Firestore query in production
    // For now we'll use mock data
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock data
      const mockPayments: Payment[] = [];
      const methods = ['bank', 'crypto', 'highRisk'] as const;
      const statuses = ['completed', 'pending', 'failed'] as const;
      
      for (let i = 1; i <= 20; i++) {
        const method = methods[Math.floor(Math.random() * methods.length)];
        const status = statuses[Math.floor(Math.random() * (method === 'bank' ? 2 : 3))]; // Bank transfers less likely to fail
        const amount = Math.floor(Math.random() * 10000) / 100 + 50; // $50 to $150
        
        const today = new Date();
        const date = new Date();
        date.setDate(today.getDate() - Math.floor(Math.random() * 30)); // Last 30 days
        
        mockPayments.push({
          id: `pay-${i.toString().padStart(6, '0')}`,
          orderId: `ord-${Math.floor(Math.random() * 100000)}`,
          customerId: `cust-${Math.floor(Math.random() * 1000)}`,
          customerName: `Customer ${i}`,
          amount,
          status,
          method,
          date
        });
      }
      
      // Filter payments if method is selected
      const filteredPayments = selectedPaymentMethod === 'all' 
        ? mockPayments 
        : mockPayments.filter(p => p.method === selectedPaymentMethod);
      
      // Calculate stats
      const totalRevenue = filteredPayments
        .filter(p => p.status === 'completed')
        .reduce((sum, payment) => sum + payment.amount, 0);
      
      const pendingAmount = filteredPayments
        .filter(p => p.status === 'pending')
        .reduce((sum, payment) => sum + payment.amount, 0);
      
      setPayments(filteredPayments);
      setStats({
        totalRevenue,
        pendingPayments: pendingAmount,
        recentTransactions: filteredPayments.length,
        growthRate: 12.5, // Mock growth rate
      });
      
    } catch (error) {
      console.error('Error fetching payment data:', error);
      toast.error('Failed to load payment data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getMethodLabel = (method: Payment['method']) => {
    switch (method) {
      case 'bank':
        return 'Bank Transfer';
      case 'crypto':
        return 'Cryptocurrency';
      case 'highRisk':
        return 'CC Processor';
      default:
        return 'Unknown';
    }
  };

  // Function to export payments as CSV (would be implemented in production)
  const exportPayments = () => {
    toast.success('Exporting payments data...');
    // Implementation would download a CSV file
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-surface-800 shadow rounded-lg">
        <div className="px-6 py-5 border-b border-surface-200 dark:border-surface-700">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-surface-900 dark:text-white flex items-center">
              <CircleDollarSign className="mr-2 h-5 w-5 text-primary-500" />
              Financial Overview
            </h3>
            <div className="flex items-center space-x-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="input text-sm"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
              <button 
                onClick={exportPayments}
                className="inline-flex items-center px-3 py-1.5 border border-surface-300 dark:border-surface-600 rounded-md shadow-sm text-sm font-medium text-surface-700 dark:text-surface-300 bg-white dark:bg-surface-700 hover:bg-surface-50 dark:hover:bg-surface-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg border border-surface-200 dark:border-surface-700 dark:bg-surface-700">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CircleDollarSign className="h-6 w-6 text-primary-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-surface-500 dark:text-surface-400 truncate">
                        Total Revenue
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-surface-900 dark:text-white">
                          {formatCurrency(stats.totalRevenue)}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg border border-surface-200 dark:border-surface-700 dark:bg-surface-700">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-surface-500 dark:text-surface-400 truncate">
                        Growth Rate
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-surface-900 dark:text-white">
                          {stats.growthRate}%
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg border border-surface-200 dark:border-surface-700 dark:bg-surface-700">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Calendar className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-surface-500 dark:text-surface-400 truncate">
                        Recent Transactions
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-surface-900 dark:text-white">
                          {stats.recentTransactions}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg border border-surface-200 dark:border-surface-700 dark:bg-surface-700">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingDown className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-surface-500 dark:text-surface-400 truncate">
                        Pending Payments
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-surface-900 dark:text-white">
                          {formatCurrency(stats.pendingPayments)}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-surface-800 shadow rounded-lg">
        <div className="px-6 py-5 border-b border-surface-200 dark:border-surface-700">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-surface-900 dark:text-white flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary-500" />
              Payment Transactions
            </h3>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <select
                  value={selectedPaymentMethod}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="input text-sm pl-8"
                >
                  <option value="all">All Payment Methods</option>
                  <option value="bank">Bank Transfers</option>
                  <option value="crypto">Cryptocurrency</option>
                  <option value="highRisk">CC Processor</option>
                </select>
                <Filter className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-surface-400" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="h-10 w-10 border-t-2 border-b-2 border-primary-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
              <thead className="bg-surface-50 dark:bg-surface-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    Method
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-surface-200 dark:bg-surface-800 dark:divide-surface-700">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-surface-50 dark:hover:bg-surface-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-700 dark:text-surface-300">
                      {payment.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-700 dark:text-surface-300">
                      {payment.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-700 dark:text-surface-300">
                      {formatDate(payment.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-700 dark:text-surface-300">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-700 dark:text-surface-300">
                      {getMethodLabel(payment.method)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {payments.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-sm text-surface-500 dark:text-surface-400">No payment transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsOverview;