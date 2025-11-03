import { currentUser } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import React from "react";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";
import { Code2, CodeXmlIcon, FileCode2, LucideFormInput, Sparkles } from "lucide-react";
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

  return (
    <div className="relative z-10">
      <div
        className="flex flex-col sm:flex-row items-center justify-between bg-[#0a0a0f]/80 
        backdrop-blur-xl p-1 rounded-lg gap-1 sm:gap-2"
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-2 sm:gap-3 px-2">
          <Link href="/" className="flex items-center gap-1 group relative">
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
              <span className="hidden md:block text-lg font-semibold bg-gradient-to-r from-green-400 via-blue-300 to-purple-400 text-transparent bg-clip-text">
                EditorForU
              </span>
              <span className="hidden md:block text-xs text-blue-400/60 font-medium">
                Your Code Editor
              </span>
            </div>
          </Link>

          {/* Snippets (visible always) */}
          <nav className="items-center">
            <Link
              href="/snippets"
              className="relative group flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-300 
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
          <nav className="items-center">
            <Link
              href="/practice"
              className="relative group flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-300 
              bg-gray-800/50 hover:bg-blue-500/10 border border-gray-800 hover:border-blue-500/50 
              transition-all duration-300 shadow-lg overflow-hidden"
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 
                opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <FileCode2 className="w-4 h-4 relative z-10 group-hover:rotate-3 transition-transform" />
              <span className="text-sm font-medium relative z-10 group-hover:text-white transition-colors">
                Practice
              </span>
            </Link>
          </nav>
          {user && convexUser?.role === "admin" ? (
            <nav className="items-center">
              <Link
                href="/admin"
                className="relative group flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-300 
              bg-gray-800/50 hover:bg-blue-500/10 border border-gray-800 hover:border-blue-500/50 
              transition-all duration-300 shadow-lg overflow-hidden"
              >
                <div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 
                opacity-0 group-hover:opacity-100 transition-opacity"
                />
                <LucideFormInput className="w-4 h-4 relative z-10 group-hover:rotate-3 transition-transform" />
                <span className="text-sm font-medium relative z-10 group-hover:text-white transition-colors">
                  Admin
                </span>
              </Link>
            </nav>
          ) : (
            <Link
              href="/profile"
              className="relative group flex items-center gap-1 p-1 px-2 
                rounded-md text-gray-300 bg-gray-800/50 hover:bg-blue-500/10 
                border border-gray-800 hover:border-blue-500/50 transition-all duration-300 shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <LucideFormInput className="w-3 h-3 sm:w-4 sm:h-4 relative z-10 group-hover:rotate-3 transition-transform" />
              <span className="text-[11px] sm:text-sm font-medium relative z-10 group-hover:text-white transition-colors">
                Profile
              </span>
            </Link>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex flex-wrap justify-end items-center gap-2 w-full lg:w-auto relative z-20 px-2">
          <div className="flex flex-wrap items-center gap-2 flex-1 sm:flex-none min-w-0">
            {/* Selectors */}
            <div className="flex  items-center gap-2  w-full sm:w-auto">
              <div className="flex-1 sm:flex-none min-w-[10px]">
                <ThemeSelector />
              </div>
              <div className="flex-1 sm:flex-none min-w-[90px]">
                <LanguageSelector hasAccess={Boolean(convexUser?.isPro)} />
              </div>
            </div>
          </div>

          {/* Pro Button */}
          {user && !convexUser?.isPro && (
            <Link
              href="/pricing"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/30 
      hover:border-amber-500/50 bg-gradient-to-r from-amber-500/10 to-orange-500/10 
      hover:from-amber-500/20 hover:to-orange-500/20 transition-all duration-300 shrink-0 text-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 font-medium">Pro</span>
            </Link>
          )}

          {/* Run Button */}
          <SignedIn>
            <div className="shrink-0">
              <RunButton />
            </div>
          </SignedIn>

          {/* Profile */}
          <div className="border-gray-800 pt-1 sm:pt-0 pl-1 sm:pl-3 shrink-0">
            <HeaderProfileBtn />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
