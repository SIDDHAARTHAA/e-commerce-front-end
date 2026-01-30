"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

type ToastType = "success" | "error" | "info";

type Toast = {
    id: number;
    message: string;
    type: ToastType;
};

type ToastContextType = {
    showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = "info") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-50 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`
              pointer-events-auto
              min-w-[300px] max-w-sm
              p-4 border-4 
              shadow-[8px_8px_0_#000]
              font-bold text-sm tracking-wide
              animate-in slide-in-from-right duration-300
              ${toast.type === "error"
                                ? "bg-[#2a0000] border-[#ff5555] text-[#ff5555]"
                                : toast.type === "success"
                                    ? "bg-[#1a1a1a] border-[#fce94f] text-[#fce94f]"
                                    : "bg-[#1a1a1a] border-[#729fcf] text-[#729fcf]"
                            }
            `}
                    >
                        <div className="flex justify-between items-start">
                            <span className="uppercase">&gt; {toast.type === 'error' ? 'ERROR' : 'SYSTEM_MSG'}:</span>
                            <button
                                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                                className="hover:opacity-75"
                            >
                                [X]
                            </button>
                        </div>
                        <div className="mt-2 text-[#e0e0ee] font-mono">
                            {toast.message}
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
