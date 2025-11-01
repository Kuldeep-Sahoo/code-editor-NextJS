import { currentUser } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import React from "react";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";
import { Code2, CodeXmlIcon, Sparkles } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import LanguageSelector from "./LanguageSelector";
import { SignedIn } from "@clerk/nextjs";
import RunButton from "./RunButton";
import HeaderProfileBtn from "./HeaderProfileBtn";

async function Header() {
  const user = await currentUser();
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const convexUser = await convex.query(api.users.getUser, {
    userId: user?.id || "",
  });
  console.log("from backend-->>", { convexUser });

  return (
    <div className="relative z-10">
      <div
        className="flex flex-wrap items-center justify-between bg-[#0a0a0f]/80 backdrop-blur-xl 
    p-2 rounded-lg space-y-3 sm:space-y-0"
      >
        {/* Logo Section */}
        <div className="flex items-center justify-center w-full lg:w-auto gap-3 lg:gap-8">
          <Link
            href="/"
            className="flex items-center gap-3 group relative mx-auto lg:mx-0"
          >
            <div
              className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 
          rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl"
            />
            <div
              className="relative bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] p-2 rounded-xl 
          ring-1 ring-white/10 group-hover:ring-white/20 transition-all"
            >
              <CodeXmlIcon className="size-6 text-green-400 transform -rotate-6 group-hover:rotate-0 transition-transform duration-500" />
            </div>
            <div className="flex flex-col">
              <span className="block text-lg font-semibold bg-gradient-to-r from-green-400 via-blue-300 to-purple-400 text-transparent bg-clip-text">
                EditorForU
              </span>
              <span className="block text-xs text-blue-400/60 font-medium">
                Your Code Editor
              </span>
            </div>
          </Link>

          {/* Show snippets only on large screens */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              href="/snippets"
              className="relative group flex items-center gap-2 px-4 py-1.5 rounded-lg text-gray-300 
          bg-gray-800/50 hover:bg-blue-500/10 border border-gray-800 hover:border-blue-500/50 
          transition-all duration-300 shadow-lg overflow-hidden"
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 
            opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <Code2 className="w-4 h-4 relative z-10 group-hover:rotate-3 transition-transform" />
              <span className="text-sm font-medium relative z-10 group-hover:text-white transition-colors">
                Snippets
              </span>
            </Link>
          </nav>
        </div>

        {/* Right Controls */}
        <div className="flex flex-wrap justify-center lg:justify-end items-center gap-3 sm:gap-4 w-full lg:w-auto">
          <div className="flex items-center gap-3">
            <ThemeSelector />
            <LanguageSelector hasAccess={Boolean(convexUser?.isPro)} />
          </div>

          {user && !convexUser?.isPro && (
            <Link
              href="/pricing"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-amber-500/20 
          hover:border-amber-500/40 bg-gradient-to-r from-amber-500/10 to-orange-500/10 
          hover:from-amber-500/20 hover:to-orange-500/20 transition-all duration-300"
            >
              <Sparkles className="w-4 h-4 text-amber-400 hover:text-amber-300" />
              <span className="text-sm font-medium text-amber-400/90 hover:text-amber-300">
                Pro
              </span>
            </Link>
          )}

          <SignedIn>
            <RunButton />
          </SignedIn>

          <div className=" lg:border-l border-gray-800 lg:pt-0 pl-0 lg:pl-3">
            <HeaderProfileBtn />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
