"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup({ name, email, password });
      router.push("/");
    } catch {
      setError("Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-[360px] border-4 border-[#111] bg-[#333] p-8 shadow-[8px_8px_0_#000]"
      >
        <h1 className="text-2xl font-bold mb-6 text-[#fce94f] uppercase border-b-4 border-[#111] pb-2">
          &gt; NEW_USER
        </h1>

        {error && (
          <div className="mb-4 text-sm text-[#ff5555] font-bold border-2 border-[#ff5555] p-2 bg-[#2a0000]">
            ERROR: {error}
          </div>
        )}

        <label className="block text-sm font-bold mb-2 text-[#aaa]">USERNAME</label>
        <input
          className="w-full mb-4 px-3 py-2 bg-[#222] text-[#fff] border-2 border-[#111] focus:outline-none focus:border-[#fce94f]"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="block text-sm font-bold mb-2 text-[#aaa]">EMAIL_ADDRESS</label>
        <input
          className="w-full mb-4 px-3 py-2 bg-[#222] text-[#fff] border-2 border-[#111] focus:outline-none focus:border-[#fce94f]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="block text-sm font-bold mb-2 text-[#aaa]">PASSWORD</label>
        <input
          type="password"
          className="w-full mb-6 px-3 py-2 bg-[#222] text-[#fff] border-2 border-[#111] focus:outline-none focus:border-[#fce94f]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full py-2 bg-[#729fcf] text-black font-bold border-b-4 border-r-4 border-[#111] hover:bg-[#8bb4e0] active:border-b-0 active:border-r-0 active:translate-x-[4px] active:translate-y-[4px] transition-all"
        >
          INITIALIZE
        </button>
      </form>
    </div>
  );
}
