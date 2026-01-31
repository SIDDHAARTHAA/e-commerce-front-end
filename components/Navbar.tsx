"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, loading, logout } = useAuth();

  if (loading) return null;

  return (
    <nav className="border-b-4 border-[#333] bg-[#1a1a1a] mb-8 relative overflow-hidden">
      {/* Animated background scanlines effect */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute inset-0 bg-gradient-to-b from-[#fce94f] to-transparent h-1 animate-pulse"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center relative z-10">
        {/* Left - Logo with ASCII art */}
        <div className="flex items-center gap-2">
          <span className="text-[#fce94f] text-xs font-mono">[ ✦ ]</span>
          <Link
            href="/"
            className="text-xl tracking-tight text-[#fce94f] font-bold uppercase hover:underline decoration-2 underline-offset-4 font-mono"
          >
            &gt; E-COMMERCE_CLI
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4 text-sm font-bold font-mono">
          {!user ? (
            <>
              <Link
                href="/login"
                className="px-3 py-1 bg-[#333] text-[#e0e0ee] border-b-4 border-r-4 border-[#000] hover:bg-[#444] active:border-b-0 active:border-r-0 active:translate-x-[4px] active:translate-y-[4px] transition-all"
              >
                LOGIN
              </Link>
              <Link
                href="/signup"
                className="px-3 py-1 bg-[#fce94f] text-[#000] border-b-4 border-r-4 border-[#b48f00] hover:bg-[#ffe066] active:border-b-0 active:border-r-0 active:translate-x-[4px] active:translate-y-[4px] transition-all"
              >
                SIGNUP
              </Link>
            </>
          ) : (
            <>
              <span className="px-3 py-1 bg-[#111] text-[#729fcf] border border-[#333] font-mono shadow-[inset_2px_2px_4px_#000,inset_-2px_-2px_4px_#333]">
                {`> ${user.name}`}
              </span>

              <Link
                href="/orders"
                className="px-3 py-1 bg-[#333] text-[#e0e0ee] border-b-4 border-r-4 border-[#000] hover:bg-[#444] active:border-b-0 active:border-r-0 active:translate-x-[4px] active:translate-y-[4px] transition-all"
              >
                ORDERS
              </Link>
              <Link
                href="/cart"
                className="px-3 py-1 bg-[#333] text-[#e0e0ee] border-b-4 border-r-4 border-[#000] hover:bg-[#444] active:border-b-0 active:border-r-0 active:translate-x-[4px] active:translate-y-[4px] transition-all"
              >
                CART
              </Link>

              {user.role === "ADMIN" && (
                <Link
                  href="/admin/products"
                  className="px-3 py-1 bg-[#729fcf] text-[#000] border-b-4 border-r-4 border-[#204a87] active:border-b-0 active:border-r-0 active:translate-x-[4px] active:translate-y-[4px]"
                >
                  ADMIN
                </Link>
              )}

              <button
                onClick={logout}
                className="px-3 py-1 bg-[#ff5555] text-[#fff] border-b-4 border-r-4 border-[#a40000] active:border-b-0 active:border-r-0 active:translate-x-[4px] active:translate-y-[4px] transition-all"
              >
                LOGOUT
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
