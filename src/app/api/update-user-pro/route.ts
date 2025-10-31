import { NextResponse } from "next/server";
import Stripe from "stripe";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { sessionId } = await req.json();
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  const userId = session.metadata?.userId;
  if (!userId)
    return NextResponse.json({ error: "User not found" }, { status: 400 });

  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  await convex.mutation(api.users.updateUserProStatus, {
    userId,
    isPro: true,
    proSince: Date.now(),
  });

  return NextResponse.json({ success: true });
}
