'use client';

import { useEffect, useState } from 'react';
import { Coupon } from '@/lib/types';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      // This would connect to the discounts collection in Firestore
      // For now, showing placeholder
      setCoupons([]);
    } catch (error) {
      console.error('Error fetching coupons:', error);
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
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Coupons</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage discount codes and promotions
          </p>
        </div>
        <Link
          href="/coupons/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-5 w-5" />
          Create Coupon
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {coupons.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No coupons found</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {coupons.map((coupon) => (
              <li key={coupon.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{coupon.code}</p>
                    <p className="text-sm text-gray-500">
                      {coupon.type === 'percentage' 
                        ? `${coupon.value}% off`
                        : `₹${coupon.value} off`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {coupon.usedCount} / {coupon.usageLimit || '∞'} used
                    </p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      coupon.isActive 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

