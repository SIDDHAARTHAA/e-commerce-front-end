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
                ₹{item.product.price}
            </div>

            <div className="flex items-center justify-center gap-1">
                <button
                    onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="w-6 h-6 border border-black flex items-center justify-center bg-[#eaeaea] hover:bg-[#dcdcdc] active-press"
                >
                    -
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="w-6 h-6 border border-black flex items-center justify-center bg-[#eaeaea] hover:bg-[#dcdcdc] active-press"
                >
                    +
                </button>
            </div>

            <div className="text-right">
                <button
                    onClick={() => onRemove(item.id)}
                    className="text-red-600 hover:text-red-800 hover:underline px-2"
                >
                    [x]
                </button>
            </div>
        </div>
    );
}
