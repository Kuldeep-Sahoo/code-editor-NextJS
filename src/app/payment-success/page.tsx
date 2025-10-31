"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) return;
      const res = await fetch("/api/update-user-pro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json();
      setStatus(
        data.success ? "✅ Payment verified!" : "❌ Verification failed."
      );
    };
    verifyPayment();
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg font-semibold">{status}</p>
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
