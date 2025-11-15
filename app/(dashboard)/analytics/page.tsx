'use client';

import { useEffect, useState } from 'react';
import { AnalyticsData } from '@/lib/types';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics');
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return <div>No analytics data available</div>;
  }

  const revenueData = {
    labels: analytics.revenueByPeriod.map((item) => item.period),
    datasets: [
      {
        label: 'Revenue',
        data: analytics.revenueByPeriod.map((item) => item.revenue),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
      },
    ],
  };

  const ordersData = {
    labels: analytics.ordersByDate.map((item) => item.date),
    datasets: [
      {
        label: 'Orders',
        data: analytics.ordersByDate.map((item) => item.count),
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
      },
    ],
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-2 text-sm text-gray-600">
          Sales and performance metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h2>
          <Line data={revenueData} />
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Orders by Date</h2>
          <Bar data={ordersData} />
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Top Products</h2>
        <div className="space-y-2">
          {analytics.topProducts.map((product, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm text-gray-900">{product.name}</span>
              <span className="text-sm font-medium text-gray-900">
                ₹{product.revenue.toLocaleString()} ({product.quantity} sold)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

