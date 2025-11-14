"use client";

import { usePathname, useRouter } from "next/navigation";
import HeaderProfileBtn from "@/app/(root)/_components/HeaderProfileBtn";
import { SignedOut } from "@clerk/nextjs";
import { Code2, CodeXmlIcon, LucideFormInput, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const NavigationHeader = () => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/getRole");
        const data = await res.json();
        setRole(data.role);
      } catch {}
    })();
  }, []);

  const router = useRouter();
  const pathname = usePathname(); // <-- current path

  const handleNavigate = (path: string) => router.push(path);

  // Utility to apply active style
  const getLinkClasses = (path: string) => {
    const baseClasses =
      "group flex items-center gap-1 px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-md text-gray-300 border border-gray-800 transition-all duration-300";
    const hoverBg = "hover:bg-blue-500/10 hover:border-blue-500/50";

    const activeBg = "bg-blue-500/20 border-red-500/60 text-white";

    return pathname === path
      ? `${baseClasses} ${activeBg}`
      : `${baseClasses} bg-gray-800/50 ${hoverBg}`;
  };

  return (
    <div className="sticky top-0 z-50 w-full border-b border-gray-800/50 bg-gray-950/80 backdrop-blur-sm backdrop-saturate-150">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="relative h-12 sm:h-14 flex items-center justify-between gap-1 sm:gap-2">
          {/* Left Logo */}
          <div
            onClick={() => handleNavigate("/")}
            className="flex items-center gap-1.5 sm:gap-3 group relative cursor-pointer"
          >
            <div className="relative bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] p-1 sm:p-2 rounded-lg sm:rounded-xl ring-1 ring-white/10 group-hover:ring-white/20 transition-all">
              <CodeXmlIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 transform -rotate-6 group-hover:rotate-0 transition-transform duration-500" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm sm:text-lg font-semibold bg-gradient-to-r from-green-400 via-blue-300 to-purple-400 text-transparent bg-clip-text">
                EditorForU
              </span>
              <span className="text-[9px] sm:text-xs text-blue-400/60 font-medium">
                Your Code Editor
              </span>
            </div>
          </div>

          {/* Center Links */}
          <div className="flex items-center gap-1 sm:gap-3">
            <Link href="/snippets" className={getLinkClasses("/snippets")}>
              <Code2 className="w-3 h-3 sm:w-4 sm:h-4 group-hover:rotate-3 transition-transform" />
              <span className="text-[11px] sm:text-sm font-medium group-hover:text-white">
                Snippets
              </span>
            </Link>

            <Link href="/practice" className={getLinkClasses("/practice")}>
              <Code2 className="w-3 h-3 sm:w-4 sm:h-4 group-hover:rotate-3 transition-transform" />
              <span className="text-[11px] sm:text-sm font-medium group-hover:text-white">
                Practice
              </span>
            </Link>

            {role === "admin" ? (
              <Link
                href="/admin"
                className={getLinkClasses("/admin") + " shadow-lg"}
              >
                <LucideFormInput className="w-3 h-3 sm:w-4 sm:h-4 relative z-10 group-hover:rotate-3 transition-transform" />
                <span className="text-[11px] sm:text-sm font-medium relative z-10 group-hover:text-white transition-colors">
                  Admin
                </span>
              </Link>
            ) : (
              <Link
                href="/profile"
                className={getLinkClasses("/profile") + " shadow-lg"}
              >
                <LucideFormInput className="w-3 h-3 sm:w-4 sm:h-4 relative z-10 group-hover:rotate-3 transition-transform" />
                <span className="text-[11px] sm:text-sm font-medium relative z-10 group-hover:text-white transition-colors">
                  Profile
                </span>
              </Link>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <SignedOut>
              <button
                onClick={() => handleNavigate("/pricing")}
                className="flex items-center gap-1 px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-md border border-amber-500/20 hover:border-amber-500/40 bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 transition-all duration-300"
              >
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400" />
                <span className="text-[11px] sm:text-sm font-medium text-amber-400/90">
                  Pro
                </span>
              </button>
            </SignedOut>

            <HeaderProfileBtn />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationHeader;
