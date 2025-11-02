"use client";
import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

const LoadingSkeleton = ({ showProOverlay = false }) => {
  return (
    <div className="w-full relative flex flex-col md:flex-row h-[90vh] bg-[#0a0a0f] text-white animate-pulse overflow-hidden">
      {/* Left Panel */}
      <div className="w-full md:w-[20%] bg-[#111] border-b md:border-b-0 md:border-r border-gray-800 p-2">
        <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto mb-4"></div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-8 bg-[#1a1a1a] rounded mb-2 border border-gray-800"
          ></div>
        ))}
      </div>

      {/* Middle Panel */}
      <div className="w-full md:w-[30%] p-4 border-b md:border-b-0 md:border-r border-gray-800">
        <div className="h-6 bg-gray-700 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6 mb-4"></div>

        <div className="h-5 bg-gray-700 rounded w-1/3 mb-3"></div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-900 h-16 rounded-lg border border-gray-800 mb-2"
          ></div>
        ))}
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-[50%] p-4 flex flex-col">
        <div className="h-8 bg-gray-700 rounded w-32 mb-3"></div>
        <div className="flex-1 bg-[#1a1a1a] rounded-lg border border-gray-800 mb-4"></div>
        <div className="h-10 bg-blue-700/50 rounded-md"></div>
      </div>

      {/* 🔥 Blur Overlay + Pro Message */}
      {showProOverlay && (
        <div className="absolute inset-0 backdrop-blur-md bg-black/60 flex flex-col items-center justify-center text-center px-6">
          <div className="flex flex-col items-center gap-6 justify-center text-gray-100">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              This is a Pro feature. Please upgrade to Pro to access practice
              problems.
            </h1>
            <Link
              href="/pricing"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/30 
                hover:border-amber-500/50 bg-gradient-to-r from-amber-500/10 to-orange-500/10 
                hover:from-amber-500/20 hover:to-orange-500/20 transition-all duration-300 shrink-0 text-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 font-medium">Get Pro</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingSkeleton;
