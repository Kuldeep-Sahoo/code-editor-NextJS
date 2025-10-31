"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const razorpayPaymentId = searchParams.get("razorpay_payment_id");
  const razorpayOrderId = searchParams.get("razorpay_order_id");
  const razorpaySignature = searchParams.get("razorpay_signature");
  const userId = searchParams.get("userId");

  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) return;

      try {
        console.log(" Calling verification API...");
        const res = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_payment_id: razorpayPaymentId,
            razorpay_order_id: razorpayOrderId,
            razorpay_signature: razorpaySignature,
            userId,
          }),
        });

        console.log({res});
        const data = await res.json();

        if (data.success) {
          setStatus("✅ Payment verified!");
          setTimeout(() => router.push("/"), 2000); // ✅ clean redirect
        } else {
          setStatus("❌ Verification failed.");
        }
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("❌ Verification failed.");
      }
    };

    verifyPayment();
  }, [razorpayPaymentId, razorpayOrderId, razorpaySignature, userId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <p
        className={`text-xl font-semibold ${
          status.includes("✅")
            ? "text-green-400"
            : status.includes("❌")
              ? "text-red-400"
              : "text-yellow-400"
        }`}
      >
        {status}
      </p>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<p>Loading payment details...</p>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
