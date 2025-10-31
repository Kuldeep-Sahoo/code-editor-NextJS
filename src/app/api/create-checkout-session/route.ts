// app/api/create-checkout-session/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { userId } = await req.json();
  const origin = req.headers.get("origin") || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: "Pro Membership",
          },
          unit_amount: 39900,
        },
        quantity: 1,
      },
    ],
    metadata: { userId }, // ✅ attach to metadata
    success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cancel`,
  });

  return NextResponse.json({ url: session.url });
}
