import NavigationHeader from "@/components/NavigationHeader";
import { currentUser } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";
import ProPlanView from "./_components/ProPlanView";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import LoginButtom from "../(root)/_components/LoginButtom";
import PayButton from "./_components/PayButton"; // ✅ new client component
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await currentUser();
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const convexUser = await convex.query(api.users.getUser, {
    userId: user?.id || "",
  });
    if (!user) {
      redirect("/");
    }

  if (convexUser?.isPro) return <ProPlanView />;

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] selection:bg-blue-500/20 selection:text-blue-200">
      <NavigationHeader />

      <main className="relative pt-5 pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Pricing */}
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute -inset-px bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-10" />
            <div className="relative bg-[#12121a]/90 backdrop-blur-xl rounded-2xl">
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
              <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

              <div className="relative p-8 md:p-12 text-center">
                <div className="text-center mb-24">
                  <div className="relative inline-block">
                    <div className="absolute -inset-px bg-gradient-to-r from-blue-500 to-purple-500 blur-xl opacity-10" />
                    <h1 className="relative text-5xl md:text-6xl lg:text-7xl font-semibold bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text mb-8">
                      Go <span className="text-blue-400">Pro</span> Today
                    </h1>
                  </div>
                  <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    Upgrade to unlock everything in one click.
                  </p>
                </div>

                {/* ✅ Replaced Pay button here */}
                <PayButton />

                <h2 className="text-3xl font-semibold text-white mb-4">
                  Lifetime Access
                </h2>
                <div className="flex items-baseline justify-center gap-2 mb-4">
                  <span className="text-2xl text-gray-400">₹</span>
                  <span className="text-6xl font-semibold bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text">
                    399
                  </span>
                </div>
                <p className="text-gray-400 text-lg mb-8">
                  One-time payment, forever benefits.
                </p>

                <div className="flex justify-center">
                  <SignedIn />
                  <SignedOut>
                    <LoginButtom />
                  </SignedOut>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
