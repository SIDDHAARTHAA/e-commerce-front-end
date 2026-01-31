"use client";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import api from "@/lib/api";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  tags: string;
};

export default function ProductCard({
  product,
  isLast,
}: {
  product: Product;
  isLast: boolean;
}) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const addToCart = async () => {
    if (!user) {
      showToast("PLEASE LOGIN FIRST", "error");
      return;
    }

    try {
      const res = await api.post("/cart", {
        productId: product.id,
        quantity: 1,
      });

      if (res.status === 201 || res.status === 200) {
        showToast("ITEM_ADDED_TO_CART", "success");
      } else {
        throw new Error("Unexpected status code");
      }
    } catch (err: any) {
      console.error("Cart Add Failed:", err);
      // Detailed error if available
      const msg = err.response?.data?.message || err.message || "Unknown Error";
      showToast(`FAILED_TO_ADD: ${msg}`, "error");
    }
  };

  return (
    <div
      className={`grid grid-cols-[1fr_120px_120px] gap-4 p-4 bg-[#1a1a1a] border-2 border-[#333] shadow-[4px_4px_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#000] transition-all`}
    >
      {/* Info */}
      <div>
        <div className="font-bold text-[#fce94f] text-lg mb-1">{product.name}</div>
        <div className="text-sm text-[#bbb] leading-relaxed">
          {product.description}
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center justify-center font-bold text-xl text-[#e0e0ee]">
        ${product.price.toFixed(2)}
      </div>

      {/* Action */}
      <div className="flex items-center justify-center">
        <button
          onClick={addToCart}
          className="px-4 py-2 bg-[#fce94f] text-[#000] font-bold border-b-4 border-r-4 border-[#b48f00] hover:bg-[#ffe066] active:border-b-0 active:border-r-0 active:translate-x-[4px] active:translate-y-[4px] transition-all"
        >
          ADD +
        </button>
      </div>
    </div>
  );
}
