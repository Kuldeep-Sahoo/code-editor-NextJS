// app/admin/page.jsx
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import AdminPanel from "./_components/AdminPanel";
import {api} from "../../../../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

export default async function Page() {
  const user = await currentUser();

  // If not logged in → redirect to home
  if (!user) redirect("/");

  // Fetch user role from Convex
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

  const convexUser = await convex.query(api.users.getUser, {
    userId: user?.id || "",
  });
  console.log({ convexUser });


  const { role } = convexUser;

  // Redirect non-admins
  if (role !== "admin") redirect("/");

  return <AdminPanel />;
}
