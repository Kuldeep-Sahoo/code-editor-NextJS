// app/api/create-order/route.ts
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    const options = {
      amount: 39900, // amount in paise (INR 399.00)
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: { userId },
    };

    const order = await razorpay.orders.create(options);
    console.log({ order });

    return NextResponse.json(order);
  } catch (err) {
    console.error("Razorpay Order Error:", err);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
