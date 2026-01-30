"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import ProductCard from "@/components/ProductCard";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  tags: string;
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products")
      .then((res) => {
        // API returns { count, data: Product[] } where price may be a string
        const payload = res.data && res.data.data ? res.data.data : res.data;
        const normalized = Array.isArray(payload)
          ? payload.map((p: any) => ({ ...p, price: Number(p.price) }))
          : [];
        setProducts(normalized);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="font-mono p-6">
        Loading products…
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl mb-8 border-b-4 border-[#333] pb-2 text-[#fce94f] uppercase tracking-widest font-bold">
        &gt; CATALOG_INDEX
      </h1>

      <div className="flex flex-col gap-6">
        {products.map((product, idx) => (
          <ProductCard
            key={product.id}
            product={product}
            isLast={idx === products.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
