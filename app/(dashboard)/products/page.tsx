'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { format } from 'date-fns';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function ProductsPage() {
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
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your product catalog
          </p>
        </div>
        <Link
          href="/products/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Product
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {products.map((product) => (
            <li key={product.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    {product.images[0] && (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="h-16 w-16 object-cover rounded mr-4"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                      <p className="text-sm text-gray-500">Stock: {product.inventory.quantity}</p>
                    </div>
                  </div>
                  <div className="ml-4 flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900">₹{product.price.toLocaleString()}</p>
                    <Link
                      href={`/products/${product.id}/edit`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found</p>
        </div>
      )}
    </div>
  );
}

