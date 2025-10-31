// app/api/verify-payment/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

export async function POST(req: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
    } = await req.json();

    console.log({razorpay_order_id,razorpay_payment_id,razorpay_signature,userId});
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ success: false, error: "Missing parameters" });
    }

    // Verify Razorpay signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ success: false, error: "Invalid signature" });
    }

    // ✅ If verified, update user status in Convex
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    await convex.mutation(api.users.updateUserProStatus, {
      userId,
      isPro: true,
      proSince: Date.now(),
    });
    console.log("done yaar");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error verifying Razorpay payment:", err);
    return NextResponse.json({ success: false, error: err });
  }
}
