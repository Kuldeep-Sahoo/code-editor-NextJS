"use client";

import { useUser } from "@clerk/nextjs";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PayButton() {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const userId = user?.id || "";

  async function loadRazorpayScript() {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) return resolve(true); // Already loaded
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => reject("Razorpay SDK failed to load.");
      document.body.appendChild(script);
    });
  }

  async function handlePay() {
    try {
      setLoading(true);

      // ✅ Load Razorpay SDK first
      await loadRazorpayScript();

      // ✅ Create order
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      if (!data.id) throw new Error("Failed to create Razorpay order.");

      // ✅ Initialize Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Pro Membership",
        description: "Upgrade to Pro Membership",
        order_id: data.id,
        theme: { color: "#6366f1" },
        handler: async function (response: any) {
          // ✅ Verify payment
          const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, userId }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            const query = new URLSearchParams({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              userId,
            }).toString();

            // ✅ Redirect with params
            window.location.href = `/payment-success?${query}`;
          } else {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          email: user?.primaryEmailAddress?.emailAddress || "",
          name: user?.fullName || "",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment Error:", err);
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative inline-flex items-center justify-center p-[2px] rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 mb-6 group hover:scale-105 transition-transform duration-300">
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
