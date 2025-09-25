
'use client';

import { useContext } from 'react';
import { AppContext } from '@/context/AppContext';
import { ProductCard } from '@/components/customer/product-card';

export default function DashboardPage() {
  const { products } = useContext(AppContext);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold">Browse & Order</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
