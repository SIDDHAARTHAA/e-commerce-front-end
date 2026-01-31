"use client";

type Product = {
    id: number;
    name: string;
    price: number;
};

type CartItemProps = {
    item: {
        id: number; // Cart item ID
        quantity: number;
        product: Product;
    };
    onUpdateQuantity: (id: number, newQty: number) => void;
    onRemove: (id: number) => void;
};

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
    return (
        <div className="grid grid-cols-[1fr_100px_100px_80px] gap-4 items-center p-2 border-b border-black text-sm">
            <div className="font-bold truncate">
                {item.product.name}
            </div>

            <div className="text-right">
                ${Number(item.product.price || 0).toFixed(2)}
            </div>

            <div className="flex items-center justify-center gap-2">
                <button
                    onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="w-8 h-8 border-b-4 border-r-4 border-[#111] flex items-center justify-center bg-[#fce94f] text-[#000] font-bold hover:bg-[#ffe066] active:border-b-0 active:border-r-0 active:translate-x-1 active:translate-y-1 transition-all"
                >
                    −
                </button>
                <span className="w-8 text-center font-bold text-[#fff]">{item.quantity}</span>
                <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 border-b-4 border-r-4 border-[#111] flex items-center justify-center bg-[#fce94f] text-[#000] font-bold hover:bg-[#ffe066] active:border-b-0 active:border-r-0 active:translate-x-1 active:translate-y-1 transition-all"
                >
                    +
                </button>
            </div>

            <div className="text-right">
                <button
                    onClick={() => onRemove(item.id)}
                    className="px-3 py-1 bg-[#ff5555] text-[#fff] font-bold border-b-4 border-r-4 border-[#a40000] hover:bg-[#ff7777] active:border-b-0 active:border-r-0 active:translate-x-1 active:translate-y-1 transition-all text-sm"
                >
                    REMOVE
                </button>
            </div>
        </div>
    );
}
