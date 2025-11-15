'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Customer } from '@/lib/types';
import { format } from 'date-fns';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      if (response.ok) {
        const data = await response.json();
        setCustomers(data.customers || []);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your customer database
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {customers.map((customer) => (
            <li key={customer.uid}>
              <Link href={`/customers/${customer.uid}`} className="block hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {customer.profile.firstName} {customer.profile.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{customer.email}</p>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {customer.profile.orderCount} orders
                      </p>
                      <p className="text-sm text-gray-500">
                        ₹{customer.profile.totalSpent.toLocaleString()} spent
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {customers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No customers found</p>
        </div>
      )}
    </div>
  );
}

