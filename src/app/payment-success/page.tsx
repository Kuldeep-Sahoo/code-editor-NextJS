"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (sessionId) {
      // Call your Convex mutation to set isPro=true
      fetch("/api/update-user-pro", {
        method: "POST",
        body: JSON.stringify({ sessionId }),
      }).then(() => {
        router.push("/"); // Redirect to homepage
      });
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-white">
      <h1 className="text-3xl font-bold">Processing your payment...</h1>
    </div>
  );
}
