"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    tags: string;
};

export default function ProductDetailPage() {
    const { id } = useParams();
    const { user } = useAuth();

    const { showToast } = useToast();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (!id) return;

        api.get(`/products/${id}`)
            .then((res) => {
                const data = res.data;
                // Normalize price if needed
                data.price = Number(data.price);
                setProduct(data);
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    const addToCart = async () => {
        if (!user) {
            showToast("PLEASE LOGIN FIRST", "error");
            return;
        }

        if (!product) return;

        try {
            const res = await api.post("/cart", {
                productId: product.id,
                quantity: quantity,
            });

            if (res.status === 201 || res.status === 200) {
                showToast("ITEM_ADDED_TO_CART", "success");
            } else {
                throw new Error("Unexpected status code");
            }
        } catch (err: any) {
            console.error(err);
            const msg = err.response?.data?.message || err.message || "Unknown Error";
            showToast(`FAILED_TO_ADD: ${msg}`, "error");
        }
    };

    if (loading) {
        return <div className="p-6 font-mono text-[#e0e0ee]">LOADING_DATA...</div>;
    }

    if (!product) {
        return <div className="p-6 font-mono text-[#ff5555]">ERROR: PRODUCT_NOT_FOUND</div>;
    }

    return (
        <div className="max-w-3xl mx-auto p-4">
            <div className="border-4 border-[#333] p-6 bg-[#1a1a1a] shadow-[8px_8px_0_#000]">
                <h1 className="text-3xl font-bold mb-6 text-[#fce94f] uppercase border-b-4 border-[#333] pb-2">
                    {product.name}
                </h1>

                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        {/* Placeholder for product image */}
                        <div className="w-full h-64 border-4 border-[#333] flex flex-col items-center justify-center bg-[#111] text-[#555] font-bold">
                            <span className="text-4xl mb-2">?</span>
                            <span>NO_IMG_DATA</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div>
                            <span className="bg-[#fce94f] text-black font-bold px-2 py-1 text-sm uppercase block w-fit mb-2">Description</span>
                            <p className="text-sm leading-relaxed text-[#bbb] border-l-4 border-[#333] pl-4">
                                {product.description}
                            </p>
                        </div>

                        <div>
                            <span className="bg-[#729fcf] text-black font-bold px-2 py-1 text-sm uppercase block w-fit mb-2">Specs</span>
                            <div className="text-sm text-[#bbb] space-y-1">
                                <p><span className="text-[#aaa]">PRICE:</span> <span className="text-[#e0e0ee] text-lg font-bold">${product.price.toFixed(2)}</span></p>
                                <p><span className="text-[#aaa]">TAGS:</span> [{product.tags}]</p>
                            </div>
                        </div>

                        <div className="mt-auto pt-6 border-t-4 border-[#333]">
                            <label className="text-xs font-bold text-[#aaa] uppercase block mb-2">Quantity_Select</label>
                            <div className="flex gap-4">
                                <input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    className="w-20 border-2 border-[#333] p-2 text-center bg-[#111] text-[#fff] focus:border-[#fce94f] focus:outline-none"
                                />
                                <button
                                    onClick={addToCart}
                                    className="flex-1 bg-[#fce94f] text-black font-bold border-b-4 border-r-4 border-[#b48f00] hover:bg-[#ffe066] active:border-b-0 active:border-r-0 active:translate-x-[4px] active:translate-y-[4px] transition-all uppercase"
                                >
                                    ADD_TO_CART
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
