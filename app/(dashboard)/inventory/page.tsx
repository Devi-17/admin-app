'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/lib/types';
import { AlertTriangle } from 'lucide-react';

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const lowStockProducts = products.filter(
    (p) => p.inventory.quantity <= p.inventory.lowStockThreshold
  );

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
        <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
        <p className="mt-2 text-sm text-gray-600">
          Monitor and manage product inventory
        </p>
      </div>

      {lowStockProducts.length > 0 && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
            <p className="text-sm font-medium text-yellow-800">
              {lowStockProducts.length} product(s) are running low on stock
            </p>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {products.map((product) => {
            const isLowStock = product.inventory.quantity <= product.inventory.lowStockThreshold;
            return (
              <li key={product.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      {product.images[0] && (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="h-12 w-12 object-cover rounded mr-4"
                        />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <p className={`text-sm font-medium ${
                        isLowStock ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {product.inventory.quantity} units
                      </p>
                      {isLowStock && (
                        <p className="text-xs text-red-600">Low stock</p>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

