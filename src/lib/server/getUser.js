import { currentUser } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

export async function getUser() {
  try {
    const user = await currentUser();
    if (!user) return false;

    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
    const convexUser = await convex.query(api.users.getUser, {
      userId: user.id,
    });

    return convexUser;
  } catch (err) {
    console.error("Error fetching Pro status:", err);
    return false;
  }
}
