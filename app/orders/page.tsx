"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

type OrderItem = {
    id: number;
    name: string;
    price: number;
    quantity: number;
};

type Order = {
    id: number;
    netAmount: number;
    createdAt: string;
    status?: string; // API docs show status in 'orderEvents' but simpler to just show ID and Date
    orderProducts: OrderItem[];
};

export default function OrdersPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            api.get("/orders")
                .then((res) => setOrders(res.data))
                .catch((err) => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [user]);

    if (loading) return <div className="p-6 font-mono">Loading orders...</div>;
    if (!user) return <div className="p-6 font-mono">Please login to view orders.</div>;

    if (orders.length === 0) {
        return (
            <div className="p-6 font-mono max-w-5xl mx-auto">
                No orders found. <Link href="/" className="underline">Start shopping</Link>.
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-4">
            <h1 className="text-3xl mb-8 border-b-4 border-[#333] pb-2 text-[#fce94f] uppercase tracking-widest font-bold">
                &gt; ORDER_LOGS
            </h1>

            <div className="flex flex-col gap-6">
                {orders.map((order) => (
                    <div key={order.id} className="border-2 border-[#111] p-6 bg-[#333] shadow-[4px_4px_0_#000]">
                        <div className="flex justify-between items-start mb-4 border-b border-[#555] pb-4">
                            <div>
                                <div className="font-bold text-[#fce94f] text-lg">LOG #{order.id}</div>
                                <div className="text-sm text-[#aaa] mt-1">
                                    TIMESTAMP: {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}
                                </div>
                            </div>
                            <div className="font-bold text-2xl text-[#e0e0ee]">
                                ₹{Number(order.netAmount || 0).toFixed(2)}
                            </div>
                        </div>

                        <div className="space-y-3">
                            {order.orderProducts.map((p) => (
                                <div key={p.id} className="text-sm flex justify-between items-center text-[#e0e0ee] bg-[#2a2a2a] p-2 border border-[#444]">
                                    <span>{p.quantity} x <span className="text-[#729fcf] font-bold">{p.name}</span></span>
                                    <span className="font-mono">₹{(p.price * p.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
