'use client';

import { useEffect, useState } from 'react';
import { ShoppingBag, DollarSign, Users, TrendingUp } from 'lucide-react';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  averageOrderValue: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/analytics');
      if (response.ok) {
        const data = await response.json();
        setStats({
          totalOrders: data.totalOrders || 0,
          totalRevenue: data.totalRevenue || 0,
          totalCustomers: data.totalCustomers || 0,
          averageOrderValue: data.averageOrderValue || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      name: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      name: 'Total Customers',
      value: stats.totalCustomers,
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      name: 'Avg Order Value',
      value: `₹${stats.averageOrderValue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Overview of your e-commerce platform
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card) => (
          <div
            key={card.name}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${card.color} rounded-md p-3`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {card.name}
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {card.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Recent Activity
          </h2>
          <p className="text-sm text-gray-500">
            Recent orders and updates will appear here
          </p>
        </div>
      </div>
    </div>
  );
}

