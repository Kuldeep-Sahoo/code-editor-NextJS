"use client";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Copy,
  Terminal,
} from "lucide-react";
import React, { useState } from "react";
import RunningCodeSkeleton from "./RunningCodeSkeleton";

const OutputPanel = () => {
  const { output, error, isRunning } = useCodeEditorStore();
  const [isCopied, setIsCopied] = useState(false);

  const hasContent = error || output;

  const handleCopy = async () => {
    if (!hasContent) return;
    await navigator.clipboard.writeText(hasContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="relative bg-[#181825] rounded-xl ring-1 ring-gray-800/50 h-full w-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3 gap-2 px-3 sm:px-4 pt-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-[#1e1e2e] ring-1 ring-gray-800/50">
            <Terminal className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-sm sm:text-base font-medium text-gray-300">
            Output
          </span>
        </div>

        {hasContent && (
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-1.5 px-2 py-1.5 
              text-xs sm:text-sm text-gray-400 hover:text-gray-300 bg-[#1e1e2e] 
              rounded-lg ring-1 ring-gray-800/50 hover:ring-gray-700/50 transition-all"
          >
            {isCopied ? (
              <>
                <CheckCircle className="w-3.5 h-3.5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy
              </>
            )}
          </button>
        )}
      </div>

      {/* Output Area */}
      <div className="relative flex-1 overflow-auto px-3 sm:px-4 pb-3">
        <div
          className="bg-[#1e1e2e]/50 backdrop-blur-sm border border-[#313244] 
          rounded-xl p-2 sm:p-4 h-full overflow-auto font-mono 
          text-[11px] sm:text-xs md:text-sm leading-relaxed break-words"
        >
          {isRunning ? (
            <RunningCodeSkeleton />
          ) : error ? (
            <div className="flex items-start gap-3 text-red-400">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-1" />
              <div className="space-y-1">
                <div className="font-medium text-sm sm:text-base">
                  Execution Error
                </div>
                <pre className="whitespace-pre-wrap text-red-400/80 break-words">
                  {error}
                </pre>
              </div>
            </div>
          ) : output ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 mb-1 sm:mb-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-medium text-sm sm:text-base">
                  Execution Successful
                </span>
              </div>
              <pre className="whitespace-pre-wrap text-gray-300 break-words">
                {output}
              </pre>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 text-xs sm:text-sm text-center px-2">
              <div className="flex items-center justify-center w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-gray-800/50 ring-1 ring-gray-700/50 mb-3 sm:mb-4">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <p>Run your code to see the output here...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutputPanel;
