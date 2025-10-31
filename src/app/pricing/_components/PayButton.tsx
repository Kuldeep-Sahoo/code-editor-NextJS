"use client";

import { useUser } from "@clerk/nextjs";
import { Sparkles } from "lucide-react";
import { useState } from "react";

export default function PayButton() {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const userId = user?.id || "";  


  async function handlePay() {
    try {
      setLoading(true);
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });


      const data = await res.json();

      if (!data.url) throw new Error("No checkout URL returned");

      // ✅ Use URL redirect instead of Stripe.js method
      window.location.href = data.url;
    } catch (err) {
      console.error("Payment error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative inline-flex items-center justify-center p-[2px] rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 mb-6 group hover:scale-105 transition-transform duration-300">
      <div className="absolute -inset-1 blur-md bg-gradient-to-br from-blue-500/40 via-purple-500/40 to-pink-500/40 opacity-20 group-hover:opacity-40 transition-opacity duration-300 rounded-xl" />
      <button
        onClick={handlePay}
        disabled={loading}
        className="gap-2 relative flex items-center justify-center p-3 rounded-xl bg-[#0a0a0f] hover:bg-[#12121a] ring-1 ring-gray-800/60 transition-all duration-300 disabled:opacity-50"
      >
        <span>{loading ? "Redirecting..." : "Pay"}</span>
        <Sparkles className="w-6 h-6 text-purple-400 animate-pulse group-hover:rotate-6 transition-transform duration-300" />
      </button>
    </div>
  );
}
