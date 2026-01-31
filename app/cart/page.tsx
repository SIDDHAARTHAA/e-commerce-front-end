"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import CartItem from "@/components/CartItem";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

type Address = {
    id: number;
    lineOne: string;
    lineTwo?: string;
    city: string;
    country: string;
    pincode: string;
};

type CartData = {
    items: any[];
    totalPrice: number;
    totalQuantity: number;
};

export default function CartPage() {
    const { user } = useAuth();
    const router = useRouter();
    const { showToast } = useToast();

    const [cart, setCart] = useState<CartData | null>(null);
    const [loading, setLoading] = useState(true);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

    // New Address Form State
    const [showAddAddress, setShowAddAddress] = useState(false);
    const [newAddress, setNewAddress] = useState({
        lineOne: "",
        lineTwo: "",
        city: "",
        country: "",
        pincode: ""
    });

    const fetchData = async () => {
        try {
            const [cartRes, addrRes] = await Promise.all([
                api.get("/cart"),
                api.get("/users/address")
            ]);

            // Backend sends raw array of cart items
            const cartArray = Array.isArray(cartRes.data) ? cartRes.data : cartRes.data.items || cartRes.data;

            // Transform array into CartData structure
            const totalPrice = cartArray.reduce((sum: number, item: any) => {
                return sum + (parseFloat(item.product.price) * item.quantity);
            }, 0);

            const totalQuantity = cartArray.reduce((sum: number, item: any) => {
                return sum + item.quantity;
            }, 0);

            const cartData: CartData = {
                items: cartArray,
                totalPrice,
                totalQuantity
            };

            console.log("Cart Data Loaded:", cartData);
            setCart(cartData);

            const addrList = addrRes.data;
            setAddresses(addrList);
            if (addrList.length > 0) {
                setSelectedAddressId(addrList[0].id);
            }
        } catch (error) {
            console.error("Failed to load cart/addresses", error);
            showToast("Failed to load cart data", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const updateQuantity = async (itemId: number, quantity: number) => {
        try {
            await api.patch(`/cart/${itemId}`, { quantity });
            fetchData(); // Reload to get updated totals
            showToast("Quantity updated", "success");
        } catch (e) {
            showToast("Failed to update quantity", "error");
        }
    };

    const removeItem = async (itemId: number) => {
        try {
            await api.delete(`/cart/${itemId}`);
            fetchData();
            showToast("Item removed", "info");
        } catch (e) {
            showToast("Failed to remove item", "error");
        }
    };

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post("/users/address", newAddress);
            const created = res.data;
            setAddresses([...addresses, created]);
            // Auto-select the newly added address as the default
            setSelectedAddressId(created.id);
            setShowAddAddress(false);
            setNewAddress({
                lineOne: "",
                lineTwo: "",
                city: "",
                country: "",
                pincode: ""
            });
            showToast("Address added successfully", "success");
        } catch (e) {
            showToast("Failed to add address", "error");
        }
    };

    const handleCheckout = async () => {
        if (!selectedAddressId) {
            showToast("Please select a shipping address", "error");
            return;
        }

        try {
            // Set selected address as default using /users/update endpoint
            await api.post("/users/update", {
                defaultShippingAddressId: selectedAddressId
            });

            // Then create order (which will use the default address)
            await api.post("/orders");

            showToast("Order placed successfully!", "success");
            setCart(null);
            router.push("/orders");
        } catch (error: any) {
            console.error("Checkout error:", error);
            showToast("Failed to place order", "error");
        }
    };

    if (loading) return <div className="p-6 font-mono">Loading cart...</div>;
    if (!user) return <div className="p-6 font-mono">Please login to view cart.</div>;

    if (!cart || !cart.items || cart.items.length === 0) {
        return <div className="p-6 font-mono max-w-5xl mx-auto">Your cart is empty.</div>;
    }

    return (
        <div className="max-w-5xl mx-auto p-4">
            <h1 className="text-3xl mb-8 border-b-4 border-[#333] pb-2 text-[#fce94f] uppercase tracking-widest font-bold">
                &gt; CART_CONTENTS
            </h1>

            {/* Cart Items List */}
            <div className="border-2 border-[#111] bg-[#333] mb-8 shadow-[4px_4px_0_#000]">
                <div className="grid grid-cols-[1fr_100px_100px_80px] gap-4 p-3 bg-[#222] border-b-2 border-[#111] font-bold text-sm text-[#729fcf] uppercase tracking-wider">
                    <div>Product</div>
                    <div className="text-right">Price</div>
                    <div className="text-center">Qty</div>
                    <div className="text-right">Action</div>
                </div>
                {cart.items.map((item) => (
                    <CartItem
                        key={item.id}
                        item={item}
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeItem}
                    />
                ))}
                <div className="p-4 bg-[#2a2a2a] text-right font-bold border-t-2 border-[#111] text-[#fce94f] text-xl">
                    TOTAL: ₹{cart.totalPrice.toFixed(2)}
                </div>
            </div>

            {/* Checkout Section with Address */}
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-lg mb-4 text-[#aaa] font-bold border-b-2 border-[#333] pb-1 uppercase">Shipping Address</h2>

                    {addresses.length > 0 ? (
                        <div className="mb-4">
                            <label className="block text-xs text-[#aaa] mb-2 uppercase font-bold">Select Default Shipping Address:</label>
                            <select
                                className="w-full border-2 border-[#111] p-3 bg-[#222] text-[#fff] focus:outline-none focus:border-[#fce94f]"
                                value={selectedAddressId || ""}
                                onChange={(e) => setSelectedAddressId(Number(e.target.value))}
                            >
                                <option value="">-- Select Address --</option>
                                {addresses.map(addr => (
                                    <option key={addr.id} value={addr.id}>
                                        {addr.lineOne}{addr.lineTwo ? `, ${addr.lineTwo}` : ''}, {addr.city}, {addr.country}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <div className="mb-4 text-sm text-[#ff5555]">No address found. Please add one to proceed with checkout.</div>
                    )}

                    {!showAddAddress ? (
                        <button
                            onClick={() => setShowAddAddress(true)}
                            className="px-4 py-2 mb-4 bg-[#333] text-[#729fcf] font-bold border-b-4 border-r-4 border-[#111] hover:bg-[#444] active:border-b-0 active:border-r-0 active:translate-x-[4px] active:translate-y-[4px] transition-all text-sm"
                        >
                            + ADD NEW ADDRESS
                        </button>
                    ) : (
                        <form onSubmit={handleAddAddress} className="border-2 border-[#111] p-4 bg-[#333] mb-4 shadow-[4px_4px_0_#000]">
                            <div className="grid gap-3 mb-4">
                                <input placeholder="Address Line 1" className="border-2 border-[#111] p-2 w-full bg-[#222] text-[#fff]"
                                    value={newAddress.lineOne} onChange={e => setNewAddress({ ...newAddress, lineOne: e.target.value })} required />
                                <input placeholder="Address Line 2 (Optional)" className="border-2 border-[#111] p-2 w-full bg-[#222] text-[#fff]"
                                    value={newAddress.lineTwo} onChange={e => setNewAddress({ ...newAddress, lineTwo: e.target.value })} />
                                <div className="grid grid-cols-2 gap-3">
                                    <input placeholder="City" className="border-2 border-[#111] p-2 w-full bg-[#222] text-[#fff]"
                                        value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} required />
                                    <input placeholder="Pincode" className="border-2 border-[#111] p-2 w-full bg-[#222] text-[#fff]"
                                        value={newAddress.pincode} onChange={e => setNewAddress({ ...newAddress, pincode: e.target.value })} required />
                                </div>
                                <input placeholder="Country" className="border-2 border-[#111] p-2 w-full bg-[#222] text-[#fff]"
                                    value={newAddress.country} onChange={e => setNewAddress({ ...newAddress, country: e.target.value })} required />
                            </div>
                            <div className="flex gap-4">
                                <button type="submit" className="border-b-4 border-r-4 border-[#111] px-4 py-2 bg-[#fce94f] text-[#000] font-bold text-sm active:border-b-0 active:border-r-0 active:translate-x-[2px] active:translate-y-[2px] hover:bg-[#ffe066] transition-all">SAVE_ADDR</button>
                                <button type="button" onClick={() => setShowAddAddress(false)} className="px-4 py-2 text-sm font-bold bg-[#333] text-[#aaa] border-b-4 border-r-4 border-[#111] hover:bg-[#444] active:border-b-0 active:border-r-0 active:translate-x-[2px] active:translate-y-[2px] transition-all">CANCEL</button>
                            </div>
                        </form>
                    )}
                </div>

                <div className="flex flex-col items-end justify-center">
                    <button
                        onClick={handleCheckout}
                        disabled={!selectedAddressId}
                        className="text-lg px-8 py-4 bg-[#fce94f] text-[#000] font-bold border-b-8 border-r-8 border-[#b48f00] hover:bg-[#ffe066] active:border-b-0 active:border-r-0 active:translate-x-[8px] active:translate-y-[8px] transition-all shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        CONFIRM_ORDER &gt;&gt;
                    </button>
                </div>
            </div>
        </div>
    );
}
