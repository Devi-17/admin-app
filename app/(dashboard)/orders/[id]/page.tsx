'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Order, OrderStatus } from '@/lib/types';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Package, Truck, CheckCircle } from 'lucide-react';

const statusOptions: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchOrder(params.id as string);
    }
  }, [params.id]);

  const fetchOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: OrderStatus) => {
    if (!order) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success('Order status updated');
        fetchOrder(order.id);
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      toast.error('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Order not found</p>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Orders
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
        <p className="mt-2 text-sm text-gray-600">
          {order.createdAt && format(new Date(order.createdAt), 'MMM d, yyyy h:mm a')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-gray-900">₹{item.total.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h2>
            <div className="text-sm text-gray-600">
              <p>{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
              <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Order Status */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Status</h2>
            <select
              value={order.status}
              onChange={(e) => updateStatus(e.target.value as OrderStatus)}
              disabled={updating}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Order Summary */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900">₹{order.totals.subtotal.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Shipping</dt>
                <dd className="text-sm font-medium text-gray-900">₹{order.totals.shipping.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Tax</dt>
                <dd className="text-sm font-medium text-gray-900">₹{order.totals.tax.toLocaleString()}</dd>
              </div>
              {order.totals.discount > 0 && (
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Discount</dt>
                  <dd className="text-sm font-medium text-green-600">-₹{order.totals.discount.toLocaleString()}</dd>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <dt className="text-base font-medium text-gray-900">Total</dt>
                <dd className="text-base font-bold text-gray-900">₹{order.totals.total.toLocaleString()}</dd>
              </div>
            </dl>
          </div>

          {/* Payment Info */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Payment</h2>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Method</dt>
                <dd className="text-sm font-medium text-gray-900">{order.payment.method}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Status</dt>
                <dd className="text-sm font-medium text-gray-900">{order.payment.status}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

